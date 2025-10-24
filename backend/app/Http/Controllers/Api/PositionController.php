<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Position;

class PositionController extends Controller
{
    public function byCategory(int $categoryId)
    {
        $positions = \Illuminate\Support\Facades\Cache::remember(
            'voting:positions:category:' . $categoryId,
            now()->addMinutes(5),
            function () use ($categoryId) {
                return Position::where('category_id', $categoryId)
                    ->where('status', 'active')
                    ->orderBy('display_order')
                    ->orderBy('name')
                    ->get()
                    ->toArray();
            }
        );

        return response()->json($positions);
    }
}