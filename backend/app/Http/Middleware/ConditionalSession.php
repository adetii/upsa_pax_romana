<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\StartSession;
use Symfony\Component\HttpFoundation\Response;

class ConditionalSession
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only start session if OTP code is provided (OTP verification step)
        if ($request->has('otp_code') && !empty($request->input('otp_code'))) {
            // Apply StartSession middleware
            $startSession = app(StartSession::class);
            return $startSession->handle($request, $next);
        }

        // For initial login (no OTP), proceed without session
        return $next($request);
    }
}