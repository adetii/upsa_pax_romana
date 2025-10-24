<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;

class CandidateController extends Controller
{
    public function byPosition(int $positionId)
    {
        $candidates = \Illuminate\Support\Facades\Cache::remember(
            'voting:candidates:position:' . $positionId,
            now()->addSeconds(20),
            function () use ($positionId) {
                return Candidate::where('position_id', $positionId)
                    ->where('status', 'active')
                    ->withSum('votes', 'vote_count')
                    ->orderBy('name')
                    ->get()
                    ->map(function ($candidate) {
                        return [
                            'id' => $candidate->id,
                            'name' => $candidate->name,
                            'bio' => $candidate->bio,
                            'photo_url' => $candidate->photo_url,
                            'position_id' => $candidate->position_id,
                            'status' => $candidate->status,
                            'vote_count' => $candidate->votes_sum_vote_count ?? 0,
                            'created_at' => $candidate->created_at,
                            'updated_at' => $candidate->updated_at,
                        ];
                    })
                    ->toArray();
            }
        );

        return response()->json($candidates);
    }
}