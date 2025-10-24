<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Vote;
use App\Models\Setting;
use Illuminate\Http\Request;

class PublicResultsController extends Controller
{
    public function index(Request $request)
    {
        // Guard by runtime setting, fallback to config
        $enabled = (bool) Setting::get('public_results_enabled', (bool) config('results.public_enabled'));
        if (!$enabled) {
            return response()->json(['message' => 'Public results are disabled'], 403);
        }

        $categoryId = $request->query('category_id');
        $positionId = $request->query('position_id');

        $cacheKey = 'results:public:' . ($positionId ? "position:$positionId" : ($categoryId ? "category:$categoryId" : 'all'));

        $results = \Illuminate\Support\Facades\Cache::remember(
            $cacheKey,
            now()->addSeconds(60),
            function () use ($categoryId, $positionId) {
                $query = Candidate::query()->with('position.category');

                if ($positionId) {
                    $query->where('position_id', $positionId);
                } elseif ($categoryId) {
                    $query->whereHas('position', fn($q) => $q->where('category_id', $categoryId));
                }

                $candidates = $query->get();

                return $candidates->map(function ($candidate) {
                    $votes = Vote::where('candidate_id', $candidate->id)
                        ->where('payment_status', 'success');

                    $totalVotes = (int) $votes->sum('vote_count');

                    return [
                        'category' => optional($candidate->position->category)->name,
                        'position' => optional($candidate->position)->name,
                        'candidate' => $candidate->name,
                        'total_votes' => $totalVotes,
                    ];
                })->toArray();
            }
        );

        return response()->json($results);
    }
}