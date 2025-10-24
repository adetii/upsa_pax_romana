<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Payment;
use App\Models\Position;
use App\Models\Vote;
use App\Models\Setting;
use App\Services\PaystackService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class VoteController extends Controller
{
    public function initialize(Request $request, PaystackService $paystack)
    {
        $validator = Validator::make($request->all(), [
            'candidate_id' => ['required', Rule::exists('candidates', 'id')],
            'position_id' => ['required', Rule::exists('positions', 'id')],
            'vote_count' => ['required', 'integer', 'min:1', 'max:100'],
            'amount' => ['required', 'numeric'],
            'email' => ['required', 'email'],
            'phone' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        $candidate = Candidate::findOrFail($data['candidate_id']);
        $position = Position::findOrFail($data['position_id']);

        if ($candidate->position_id !== $position->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Candidate does not belong to specified position.',
            ], 422);
        }

        // Check voting status based on category
        $category = $position->category;
        $votingType = strtolower($category->name); // 'church' or 'national'
        
        $isVotingActive = Setting::get("{$votingType}_voting_active", false);
        
        if (!$isVotingActive) {
            $lockMessage = Setting::get("{$votingType}_voting_lock_message", 
                ucfirst($votingType) . ' voting is currently not active. Please check back later.');
            
            return response()->json([
                'status' => 'error',
                'message' => $lockMessage,
            ], 403);
        }

        // Amount must equal vote_count × 1 GHC
        $expectedAmount = $data['vote_count'] * 1.0;
        if ((float) $data['amount'] !== (float) $expectedAmount) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid amount. Must equal vote_count × 1 GHC.',
            ], 422);
        }

        return DB::transaction(function () use ($data, $candidate, $position, $paystack, $request) {
            // Create pending payment
            $payment = Payment::create([
                'reference' => uniqid('ref_'),
                'amount' => $data['amount'],
                'status' => 'pending',
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'metadata' => [
                    'candidate_id' => $candidate->id,
                    'position_id' => $position->id,
                    'vote_count' => $data['vote_count'],
                ],
            ]);
        
            // Stash reference in session to recover if callback omits it
            $request->session()->put('pending_paystack_reference', $payment->reference);
        
            // Create vote record pending
            $vote = Vote::create([
                'candidate_id' => $candidate->id,
                'position_id' => $position->id,
                'payment_reference' => $payment->reference,
                'vote_count' => $data['vote_count'],
                'amount' => $data['amount'],
                'voter_phone' => $data['phone'] ?? null,
                'voter_email' => $data['email'] ?? null,
                'payment_status' => 'pending',
            ]);

            $payload = [
                'email' => $data['email'],
                'amount' => $paystack->convertToKobo($data['amount']),
                'reference' => $payment->reference,
                'callback_url' => url('/api/payment/success?reference=' . $payment->reference),
                'metadata' => [
                    'payment_id' => $payment->id,
                    'vote_id' => $vote->id,
                    'candidate_id' => $candidate->id,
                    'position_id' => $position->id,
                    'vote_count' => $data['vote_count'],
                ],
            ];

            $init = $paystack->initializeTransaction($payload);

            if (!($init['status'] ?? false)) {
                return response()->json([
                    'status' => 'error',
                    'message' => $init['message'] ?? 'Unable to initialize payment',
                ], 400);
            }

            // Store response
            $payment->update(['paystack_response' => $init]);

            return response()->json([
                'authorization_url' => $init['data']['authorization_url'] ?? null,
                'reference' => $payment->reference,
            ]);
        });
    }

    public function verify(Request $request, PaystackService $paystack)
    {
        $validator = Validator::make($request->all(), [
            'reference' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $reference = $validator->validated()['reference'];
        $payment = Payment::where('reference', $reference)->first();
        if (!$payment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment reference not found',
            ], 404);
        }

        // If already successful or memoized, return local data to avoid duplicate network calls
        if ($payment->status === 'success' || \Illuminate\Support\Facades\Cache::get('paystack:verified:' . $reference)) {
            $vote = Vote::where('payment_reference', $reference)->first();
            $candidate = $vote ? Candidate::find($vote->candidate_id) : null;
            $position = $vote ? Position::find($vote->position_id) : null;

            return response()->json([
                'reference' => $reference,
                'amount' => $payment->amount,
                'vote_count' => $vote ? $vote->vote_count : null,
                'candidate_name' => $candidate ? $candidate->name : null,
                'position_name' => $position ? $position->name : null,
                'status' => 'success',
                'message' => 'Payment already verified',
            ]);
        }

        $verify = $paystack->verifyTransaction($reference);

        if (!($verify['status'] ?? false)) {
            return response()->json([
                'status' => 'error',
                'message' => $verify['message'] ?? 'Unable to verify payment',
            ], 400);
        }

        $data = $verify['data'] ?? [];
        $successful = ($data['status'] ?? null) === 'success';

        $payment->update([
            'status' => $successful ? 'success' : 'failed',
            'paystack_response' => $verify,
        ]);

        // Update the vote record associated with this payment reference
        $vote = Vote::where('payment_reference', $reference)->first();
        if ($vote) {
            $vote->update([
                'payment_status' => $successful ? 'success' : 'failed',
                'voted_at' => $successful ? now() : null,
                'amount' => $payment->amount,
            ]);
        }

        if (!$successful) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Payment verification failed',
            ], 400);
        }

        // Invalidate relevant caches after successful verification
        $positionId = $vote ? $vote->position_id : null;
        $categoryId = $positionId ? optional(Position::find($positionId))->category_id : null;
        \Illuminate\Support\Facades\Cache::forget('dashboard:summary');
        \Illuminate\Support\Facades\Cache::forget('results:public:all');
        \Illuminate\Support\Facades\Cache::forget('results:admin:all');
        if ($positionId) {
            \Illuminate\Support\Facades\Cache::forget('voting:candidates:position:' . $positionId);
            \Illuminate\Support\Facades\Cache::forget('results:public:position:' . $positionId);
            \Illuminate\Support\Facades\Cache::forget('results:admin:position:' . $positionId);
        }
        if ($categoryId) {
            \Illuminate\Support\Facades\Cache::forget('results:public:category:' . $categoryId);
            \Illuminate\Support\Facades\Cache::forget('results:admin:category:' . $categoryId);
        }

        // Memoize successful verification to avoid duplicate network calls on refresh
        \Illuminate\Support\Facades\Cache::put('paystack:verified:' . $reference, true, now()->addMinutes(5));

        // Get candidate and position details for the receipt
        $candidate = $vote ? Candidate::find($vote->candidate_id) : null;
        $position = $vote ? Position::find($vote->position_id) : null;

        return response()->json([
            'reference' => $reference,
            'amount' => $payment->amount,
            'vote_count' => $vote ? $vote->vote_count : null,
            'candidate_name' => $candidate ? $candidate->name : null,
            'position_name' => $position ? $position->name : null,
            'status' => 'success',
            'message' => 'Payment verified and votes recorded',
        ]);
    }
}