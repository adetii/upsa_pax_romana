<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Vote;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class WebhookController extends Controller
{
    public function paystackWebhook(Request $request)
    {
        // Verify the webhook signature
        $signature = $request->header('x-paystack-signature');
        $body = $request->getContent();
        $expectedSignature = hash_hmac('sha512', $body, config('paystack.secretKey'));
        
        if (!hash_equals($expectedSignature, $signature)) {
            Log::warning('Invalid Paystack webhook signature');
            return response()->json(['status' => 'error', 'message' => 'Invalid signature'], 400);
        }

        $event = $request->input('event');
        $data = $request->input('data');

        // Handle successful payment
        if ($event === 'charge.success') {
            $reference = $data['reference'] ?? null;
            
            if (!$reference) {
                Log::warning('Paystack webhook: Missing reference in charge.success event');
                return response()->json(['status' => 'error', 'message' => 'Missing reference'], 400);
            }

            // Find the payment record
            $payment = Payment::where('reference', $reference)->first();
            
            if (!$payment) {
                Log::warning("Paystack webhook: Payment not found for reference: {$reference}");
                return response()->json(['status' => 'error', 'message' => 'Payment not found'], 404);
            }

            // Update payment status
            $payment->update([
                'status' => 'success',
                'paystack_response' => $data,
            ]);

            // Update associated vote
            $vote = Vote::where('payment_reference', $reference)->first();
            if ($vote) {
                $vote->update([
                    'payment_status' => 'success',
                    'voted_at' => now(),
                ]);

                // Invalidate caches affected by new successful vote
                $positionId = $vote->position_id;
                $categoryId = $positionId ? optional(Position::find($positionId))->category_id : null;

                Cache::forget('dashboard:summary');
                Cache::forget('results:public:all');
                Cache::forget('results:admin:all');
                Cache::forget('voting:candidates:position:' . $positionId);
                Cache::forget('results:public:position:' . $positionId);
                Cache::forget('results:admin:position:' . $positionId);
                if ($categoryId) {
                    Cache::forget('results:public:category:' . $categoryId);
                    Cache::forget('results:admin:category:' . $categoryId);
                }

                // Memoize successful verification reference for 5 minutes
                if ($reference) {
                    Cache::put('paystack:verified:' . $reference, true, now()->addMinutes(5));
                }
            }

            Log::info("Paystack webhook: Successfully processed payment for reference: {$reference}");
            
            return response()->json(['status' => 'success']);
        }

        // Handle failed payment
        if ($event === 'charge.failed') {
            $reference = $data['reference'] ?? null;
            
            if ($reference) {
                $payment = Payment::where('reference', $reference)->first();
                
                if ($payment) {
                    $payment->update([
                        'status' => 'failed',
                        'paystack_response' => $data,
                    ]);

                    $vote = Vote::where('payment_reference', $reference)->first();
                    if ($vote) {
                        $vote->update(['payment_status' => 'failed']);
                    }

                    // Clear any success memoization just in case
                    Cache::forget('paystack:verified:' . $reference);
                }
            }
            
            return response()->json(['status' => 'success']);
        }

        // Log unhandled events
        Log::info("Paystack webhook: Unhandled event type: {$event}");
        
        return response()->json(['status' => 'success']);
    }

    public function paymentSuccess(Request $request)
    {
        $reference = $request->query('reference') ?: $request->session()->get('pending_paystack_reference');

        // Resolve frontend base URL with safe local fallback
        $frontendUrlEnv = env('FRONTEND_URL', '');
        $currentOrigin = $request->getSchemeAndHttpHost();
        if (!$frontendUrlEnv) {
            $frontendBase = $currentOrigin;
        } else {
            $frontendBase = rtrim($frontendUrlEnv, '/');
            $host = parse_url($frontendBase, PHP_URL_HOST);
            $port = parse_url($frontendBase, PHP_URL_PORT);
            if (in_array($host, ['localhost', '127.0.0.1']) && !$port) {
                $frontendBase = $currentOrigin;
            }
        }

        // Clear the pending reference once read
        if ($request->session()) {
            $request->session()->forget('pending_paystack_reference');
        }
        
        if (!$reference) {
            return redirect($frontendBase . '/payment/failed?error=missing_reference');
        }

        // Find the payment record
        $payment = Payment::where('reference', $reference)->first();
        
        if (!$payment) {
            return redirect($frontendBase . '/payment/failed?error=payment_not_found');
        }

        // If payment is already marked as successful, refresh caches and redirect
        if ($payment->status === 'success') {
            $vote = \App\Models\Vote::where('payment_reference', $reference)->first();
            if ($vote) {
                $positionId = $vote->position_id;
                $categoryId = $positionId ? optional(\App\Models\Position::find($positionId))->category_id : null;

                \Illuminate\Support\Facades\Cache::forget('dashboard:summary');
                \Illuminate\Support\Facades\Cache::forget('results:public:all');
                \Illuminate\Support\Facades\Cache::forget('results:admin:all');
                \Illuminate\Support\Facades\Cache::forget('voting:candidates:position:' . $positionId);
                \Illuminate\Support\Facades\Cache::forget('results:public:position:' . $positionId);
                \Illuminate\Support\Facades\Cache::forget('results:admin:position:' . $positionId);
                if ($categoryId) {
                    \Illuminate\Support\Facades\Cache::forget('results:public:category:' . $categoryId);
                    \Illuminate\Support\Facades\Cache::forget('results:admin:category:' . $categoryId);
                }
                \Illuminate\Support\Facades\Cache::put('paystack:verified:' . $reference, true, now()->addMinutes(5));
            }
            return redirect($frontendBase . "/payment/success?reference={$reference}");
        }

        // If payment is still pending, verify with Paystack directly
        if ($payment->status === 'pending') {
            try {
                $paystack = app(\App\Services\PaystackService::class);
                $verification = $paystack->verifyTransaction($reference);
                
                if (($verification['status'] ?? false) && ($verification['data']['status'] ?? null) === 'success') {
                    // Update payment status
                    $payment->update([
                        'status' => 'success',
                        'paystack_response' => $verification,
                    ]);

                    // Update associated vote
                    $vote = \App\Models\Vote::where('payment_reference', $reference)->first();
                    if ($vote) {
                        $vote->update([
                            'payment_status' => 'success',
                            'voted_at' => now(),
                        ]);

                        $positionId = $vote->position_id;
                        $categoryId = $positionId ? optional(\App\Models\Position::find($positionId))->category_id : null;

                        \Illuminate\Support\Facades\Cache::forget('dashboard:summary');
                        \Illuminate\Support\Facades\Cache::forget('results:public:all');
                        \Illuminate\Support\Facades\Cache::forget('results:admin:all');
                        \Illuminate\Support\Facades\Cache::forget('voting:candidates:position:' . $positionId);
                        \Illuminate\Support\Facades\Cache::forget('results:public:position:' . $positionId);
                        \Illuminate\Support\Facades\Cache::forget('results:admin:position:' . $positionId);
                        if ($categoryId) {
                            \Illuminate\Support\Facades\Cache::forget('results:public:category:' . $categoryId);
                            \Illuminate\Support\Facades\Cache::forget('results:admin:category:' . $categoryId);
                        }

                        \Illuminate\Support\Facades\Cache::put('paystack:verified:' . $reference, true, now()->addMinutes(5));
                    }

                    return redirect($frontendBase . "/payment/success?reference={$reference}");
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Payment verification failed for reference {$reference}: " . $e->getMessage());
            }
        }

        // If we get here, payment verification failed or payment status is failed
        return redirect($frontendBase . '/payment/failed?error=payment_not_successful');
    }
}