<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class VotingStatusController extends Controller
{
    /**
     * Get voting status for both church and national voting
     */
    public function status()
    {
        // Get voting status from settings
        $churchActive = Setting::get('church_voting_active', false);
        $nationalActive = Setting::get('national_voting_active', false);
        
        // Get custom lock messages
        $churchLockMessage = Setting::get('church_voting_lock_message', 'Church voting is currently not active. Please check back later.');
        $nationalLockMessage = Setting::get('national_voting_lock_message', 'National voting is currently not active. Please check back later.');
        
        // Get voting start/end times for additional context
        $churchStart = Setting::get('church_voting_start');
        $churchEnd = Setting::get('church_voting_end');
        $nationalStart = Setting::get('national_voting_start');
        $nationalEnd = Setting::get('national_voting_end');

        return response()->json([
            'church_voting' => [
                'active' => $churchActive,
                'lock_message' => $churchLockMessage,
                'start_time' => $churchStart,
                'end_time' => $churchEnd,
            ],
            'national_voting' => [
                'active' => $nationalActive,
                'lock_message' => $nationalLockMessage,
                'start_time' => $nationalStart,
                'end_time' => $nationalEnd,
            ],
            'system_status' => [
                'any_active' => $churchActive || $nationalActive,
                'message' => ($churchActive || $nationalActive) 
                    ? 'Voting is currently in progress' 
                    : 'No voting is currently active'
            ]
        ]);
    }

    /**
     * Update voting lock messages (Super Admin only)
     */
    public function updateLockMessages(Request $request)
    {
        $request->validate([
            'church_lock_message' => 'nullable|string|max:500',
            'national_lock_message' => 'nullable|string|max:500',
        ]);

        // Check if user is super admin
        if (!auth()->user() || auth()->user()->role !== 'super_admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Super admin access required.',
            ], 403);
        }

        // Update lock messages
        if ($request->has('church_lock_message')) {
            Setting::set(
                'church_voting_lock_message', 
                $request->church_lock_message ?: 'Church voting is currently not active. Please check back later.',
                'Custom message shown when church voting is locked'
            );
        }

        if ($request->has('national_lock_message')) {
            Setting::set(
                'national_voting_lock_message', 
                $request->national_lock_message ?: 'National voting is currently not active. Please check back later.',
                'Custom message shown when national voting is locked'
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Voting lock messages updated successfully',
            'data' => [
                'church_lock_message' => Setting::get('church_voting_lock_message'),
                'national_lock_message' => Setting::get('national_voting_lock_message'),
            ]
        ]);
    }

    /**
     * Manually toggle voting status (Super Admin only)
     */
    public function toggleVoting(Request $request)
    {
        $request->validate([
            'type' => 'required|in:church,national',
            'active' => 'required|boolean',
        ]);

        // Check if user is super admin
        if (!auth()->user() || auth()->user()->role !== 'super_admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Super admin access required.',
            ], 403);
        }

        $type = $request->type;
        $active = $request->active;

        // Update voting status
        Setting::set("{$type}_voting_active", $active, "Active status for {$type} voting");
        
        // Set timestamp
        $timestampKey = $active ? "{$type}_voting_start" : "{$type}_voting_end";
        Setting::set($timestampKey, now()->toDateTimeString(), ($active ? "Start" : "End") . " time for {$type} voting");

        return response()->json([
            'status' => 'success',
            'message' => ucfirst($type) . ' voting ' . ($active ? 'activated' : 'deactivated') . ' successfully',
            'data' => [
                'type' => $type,
                'active' => $active,
                'timestamp' => now()->toDateTimeString(),
            ]
        ]);
    }
}