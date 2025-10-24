<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Position;
use App\Models\Candidate;
use App\Models\Vote;
use Illuminate\Http\Request;

class ResultsController extends Controller
{
    public function index(Request $request)
    {
        $categoryId = $request->query('category_id');
        $positionId = $request->query('position_id');

        $cacheKey = 'results:admin:' . ($positionId ? "position:$positionId" : ($categoryId ? "category:$categoryId" : 'all'));

        $results = \Illuminate\Support\Facades\Cache::remember(
            $cacheKey,
            now()->addSeconds(20),
            function () use ($categoryId, $positionId) {
                $query = Candidate::query()->with('position');
                if ($positionId) {
                    $query->where('position_id', $positionId);
                } elseif ($categoryId) {
                    $query->whereHas('position', fn($q) => $q->where('category_id', $categoryId));
                }

                $candidates = $query->get();

                return $candidates->map(function ($candidate) {
                    $votes = Vote::where('candidate_id', $candidate->id)->where('payment_status', 'success');
                    $totalVotes = (int) $votes->sum('vote_count');
                    $totalRevenue = (float) $votes->sum('amount');
                    $transactions = (int) $votes->count();
                    return [
                        'position_name' => $candidate->position->name,
                        'candidate_name' => $candidate->name,
                        'votes' => $totalVotes,
                        'total_votes' => $totalVotes,
                        'total_revenue' => $totalRevenue,
                        'transactions' => $transactions,
                        'category_name' => $candidate->position->category->name ?? null,
                        'position' => [
                            'name' => $candidate->position->name,
                        ],
                        'candidate' => [
                            'name' => $candidate->name,
                        ],
                        'category' => [
                            'name' => $candidate->position->category->name ?? null,
                        ],
                    ];
                })->toArray();
            }
        );

        return response()->json($results);
    }
}