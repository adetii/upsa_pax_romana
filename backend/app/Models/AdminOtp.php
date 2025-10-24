<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class AdminOtp extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'otp_code',
        'expires_at',
        'is_verified',
        'attempt_count',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_verified' => 'boolean',
        'attempt_count' => 'integer',
    ];

    /**
     * Generate a new 8-digit OTP for the given email
     */
    public static function generateOtp(string $email): string
    {
        // Delete any existing OTPs for this email
        static::where('email', $email)->delete();

        // Generate 8-digit OTP
        $otpCode = str_pad(random_int(0, 99999999), 8, '0', STR_PAD_LEFT);

        // Create new OTP record (expires in 5 minutes)
        static::create([
            'email' => $email,
            'otp_code' => $otpCode,
            'expires_at' => Carbon::now()->addMinutes(5),
            'is_verified' => false,
            'attempt_count' => 0,
        ]);

        return $otpCode;
    }

    /**
     * Verify OTP for the given email with rate limiting
     */
    public static function verifyOtp(string $email, string $otpCode): bool
    {
        $otp = static::where('email', $email)
            ->where('otp_code', $otpCode)
            ->where('is_verified', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if ($otp) {
            $otp->update(['is_verified' => true]);
            return true;
        }

        // Increment attempt count for failed verification
        $existingOtp = static::where('email', $email)
            ->where('is_verified', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if ($existingOtp) {
            $existingOtp->increment('attempt_count');
            
            // If max attempts reached, delete the OTP
            if ($existingOtp->attempt_count >= 3) {
                $existingOtp->delete();
            }
        }

        return false;
    }

    /**
     * Check if OTP attempts are exceeded for an email
     */
    public static function isRateLimited(string $email): bool
    {
        $otp = static::where('email', $email)
            ->where('is_verified', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        return $otp && $otp->attempt_count >= 3;
    }

    /**
     * Get remaining attempts for an email
     */
    public static function getRemainingAttempts(string $email): int
    {
        $otp = static::where('email', $email)
            ->where('is_verified', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$otp) {
            return 3; // No OTP exists, full attempts available
        }

        return max(0, 3 - $otp->attempt_count);
    }

    /**
     * Clean up expired OTPs
     */
    public static function cleanupExpired(): void
    {
        static::where('expires_at', '<', Carbon::now())->delete();
    }
}
