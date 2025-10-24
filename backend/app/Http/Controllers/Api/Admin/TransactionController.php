<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;


class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        $query = Payment::with(['vote.candidate', 'vote.position']);
        
        if ($status) {
            $query->where('status', $status);
        }
        
        // Compute directly without caching
        $payments = $query->orderByDesc('created_at')->get();
        $transformedPayments = $payments->map(function ($payment) {
            $vote = $payment->vote;
            return [
                'id' => $payment->id,
                'reference' => $payment->reference,
                'amount' => $payment->amount,
                'status' => $payment->status,
                'email' => $payment->email,
                'phone' => $payment->phone,
                'created_at' => $payment->created_at,
                'updated_at' => $payment->updated_at,
                'voter_name' => $vote ? ($vote->voter_email ?: $vote->voter_phone ?: 'Unknown Voter') : 'No Vote Data',
                'candidate_name' => $vote && $vote->candidate ? $vote->candidate->name : 'No Candidate',
                'position_name' => $vote && $vote->position ? $vote->position->name : 'No Position',
                'vote_count' => $vote ? $vote->vote_count : 0,
                'voted_at' => $vote ? $vote->voted_at : null,
            ];
        });
        
        return response()->json($transformedPayments);
    }
}