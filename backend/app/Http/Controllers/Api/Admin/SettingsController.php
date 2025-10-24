<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SettingsController extends Controller
{
    public function showPublicResults(Request $request)
    {
        $value = (bool) Setting::get('public_results_enabled', (bool) config('results.public_enabled'));
        return response()->json(['public_results_enabled' => $value]);
    }

    public function updatePublicResults(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'super_admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'enabled' => ['required', 'boolean'],
        ]);

        Setting::set('public_results_enabled', $validated['enabled'], 'Toggle public results visibility');

        // Bust cached settings read and public results aggregate so toggle takes effect immediately
        Cache::forget('setting:public_results_enabled');
        Cache::forget('results:public:all');

        return response()->json([
            'message' => 'Updated',
            'public_results_enabled' => (bool) $validated['enabled'],
        ]);
    }
}