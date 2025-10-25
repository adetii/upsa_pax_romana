<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AdminOtp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function entry_255081(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:6'],
            'otp_code' => ['nullable', 'string', 'size:8'],
        ]);
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }
        $data = $validator->validated();

        $user = User::where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['status' => 'error', 'message' => 'Invalid credentials'], 401);
        }

        // If OTP is provided, verify it
        if (isset($data['otp_code'])) {
            if (AdminOtp::isRateLimited($data['email'])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Too many failed attempts. Please request a new OTP.'
                ], 429);
            }

            if (!AdminOtp::verifyOtp($data['email'], $data['otp_code'])) {
                $remainingAttempts = AdminOtp::getRemainingAttempts($data['email']);

                return response()->json([
                    'status' => 'error',
                    'message' => $remainingAttempts > 0 
                        ? "Invalid or expired OTP code. {$remainingAttempts} attempts remaining."
                        : 'Too many failed attempts. Please request a new OTP.',
                    'remaining_attempts' => $remainingAttempts
                ], 401);
            }

            // OTP verified; log in the user
            Auth::login($user);

            // Ensure session exists before regenerating
            if (!$request->hasSession()) {
                $request->setLaravelSession(app('session.store'));
            }
            if ($request->session()->isStarted()) {
                $request->session()->regenerate();
            }

            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ]);
        }

        // No OTP provided, send OTP via email
        try {
            $otpCode = AdminOtp::generateOtp($data['email']);

            $sent = false;

            // Try default mailer first
            try {
                Mail::send('emails.admin-otp', [
                    'user' => $user,
                    'otpCode' => $otpCode
                ], function ($message) use ($data) {
                    $message->to($data['email']);
                    $message->subject('Admin Login OTP - St. Greg. Voting System');
                });
                $sent = true;
            } catch (\Throwable $primary) {
                Log::warning('Primary mailer failed sending admin OTP', [
                    'email' => $data['email'],
                    'error' => $primary->getMessage(),
                ]);
            }

            // Fallback to Resend if configured
            if (!$sent) {
                $resendKey = config('services.resend.api_key');
                if (!$resendKey) {
                    $resendKey = config('resend.api_key'); // also support config/resend.php
                }
                if (!$resendKey) {
                    $resendKey = env('RESEND_API_KEY'); // last resort environment var
                }

                if ($resendKey) {
                    try {
                        Mail::mailer('resend')->send('emails.admin-otp', [
                            'user' => $user,
                            'otpCode' => $otpCode
                        ], function ($message) use ($data) {
                            $message->to($data['email']);
                            $message->subject('Admin Login OTP - St. Greg. Voting System');
                        });
                        $sent = true;
                    } catch (\Throwable $fallback) {
                        Log::error('Resend mailer failed sending admin OTP', [
                            'email' => $data['email'],
                            'error' => $fallback->getMessage(),
                        ]);
                    }
                }
            }

            if (!$sent) {
                // In local/dev, return otp_required to unblock manual testing
                if (app()->isLocal() || config('app.debug')) {
                    return response()->json([
                        'status' => 'otp_required',
                        'message' => 'Email delivery failed locally. Use the shown OTP to continue.',
                        'email' => $data['email'],
                        'otp_debug' => $otpCode,
                    ]);
                }

                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to send OTP email. Please try again later.'
                ], 500);
            }

            return response()->json([
                'status' => 'otp_required',
                'message' => 'OTP has been sent to your email. Please check your inbox and enter the 8-digit code to complete Login.',
                'email' => $data['email']
            ]);
        } catch (\Exception $e) {
            Log::error('Unexpected error generating or sending OTP', [
                'email' => $data['email'],
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send OTP email. Please try again later.'
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        // Manually start session if not already started (since we removed StartSession middleware)
        if (!$request->hasSession()) {
            $request->setLaravelSession(app('session.store'));
        }

        // Only invalidate session if it exists
        if ($request->session()->isStarted()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        // Get session cookie name from config
        $sessionCookieName = config('session.cookie');
        
        // Create expired cookies using Symfony Cookie objects
        $expiredSessionCookie = new \Symfony\Component\HttpFoundation\Cookie(
            $sessionCookieName,
            '',
            time() - 3600, // Expired 1 hour ago
            config('session.path', '/'),
            config('session.domain'),
            config('session.secure', false),
            config('session.http_only', true),
            false,
            config('session.same_site')
        );

        $expiredCsrfCookie = new \Symfony\Component\HttpFoundation\Cookie(
            'CSRF-TOKEN',
            '',
            time() - 3600, // Expired 1 hour ago
            '/',
            config('session.domain'),
            config('session.secure', false),
            false, // CSRF token needs to be accessible via JavaScript
            false,
            config('session.same_site')
        );

        // Create response and attach expired cookies
        $response = response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ]);

        // Add the expired cookies to the response
        $response->headers->setCookie($expiredSessionCookie);
        $response->headers->setCookie($expiredCsrfCookie);

        return $response;
    }

    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'We can\'t find a user with that email address.'
            ], 404);
        }

        // Generate a random token
        $token = Str::random(64);

        // Store the token in password_resets table
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => Carbon::now()
            ]
        );

        // Send email with reset link
        try {
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

            $resetUrl = $frontendBase . '/admin/set-pw_255081?token=' . $token . '&email=' . urlencode($request->email);

            Mail::send('emails.password-reset', ['resetUrl' => $resetUrl, 'user' => $user], function ($message) use ($request) {
                $message->to($request->email);
                $message->subject('Reset Password Notification');
            });

            return response()->json([
                'status' => 'success',
                'message' => 'We have emailed your password reset link!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send reset email. Please try again later.'
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8', 'confirmed'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if token exists and is valid
        $passwordReset = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$passwordReset || !Hash::check($request->token, $passwordReset->token)) {
            return response()->json([
                'status' => 'error',
                'message' => 'This password reset token is invalid.'
            ], 400);
        }

        // Check if token is expired (24 hours)
        if (Carbon::parse($passwordReset->created_at)->addHours(24)->isPast()) {
            return response()->json([
                'status' => 'error',
                'message' => 'This password reset token has expired.'
            ], 400);
        }

        // Update user password
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'We can\'t find a user with that email address.'
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the password reset token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Your password has been reset!'
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'current_password' => ['required_with:password', 'string'],
            'password' => ['nullable', 'confirmed', PasswordRule::min(8)->mixedCase()->numbers()->symbols()],
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Handle name/email updates
        if (isset($data['name'])) {
            $user->name = $data['name'];
        }
        if (isset($data['email'])) {
            $user->email = $data['email'];
        }

        // Handle password change if requested
        if (isset($data['password']) && $data['password']) {
            $current = $data['current_password'] ?? null;
            if (!$current || !Hash::check($current, $user->password)) {
                return response()->json(['status' => 'error', 'message' => 'Current password is incorrect', 'errors' => ['current_password' => ['Current password is incorrect']]], 422);
            }
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }
}
