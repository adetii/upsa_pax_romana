<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vote;
use App\Models\Payment;
use App\Models\Category;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $summary = \Illuminate\Support\Facades\Cache::remember('dashboard:summary', now()->addSeconds(20), function () {
            $totalVotes = Vote::sum('vote_count');
            $totalRevenue = Payment::where('status', 'success')->sum('amount');
            $transactionsCount = Payment::count();

            $churchCategory = Category::where('name', 'Church')->first();
            $nationalCategory = Category::where('name', 'National')->first();
            $churchVotes = $churchCategory ? Vote::whereHas('position', fn($q) => $q->where('category_id', $churchCategory->id))->sum('vote_count') : 0;
            $nationalVotes = $nationalCategory ? Vote::whereHas('position', fn($q) => $q->where('category_id', $nationalCategory->id))->sum('vote_count') : 0;

            // Simple last 7 days
            $last7Days = [];
            for ($i = 6; $i >= 0; $i--) {
                $day = Carbon::today()->subDays($i);
                $votes = Vote::whereDate('created_at', $day)->sum('vote_count');
                $revenue = Payment::where('status', 'success')->whereDate('created_at', $day)->sum('amount');
                $last7Days[] = [
                    'date' => $day->toDateString(),
                    'votes' => $votes,
                    'revenue' => $revenue,
                ];
            }

            // Recent transactions (last 10)
            $recentTransactions = Payment::with(['vote.candidate', 'vote.position'])
                ->orderByDesc('created_at')
                ->limit(10)
                ->get()
                ->map(function ($payment) {
                    return [
                        'id' => $payment->id,
                        'voter' => $payment->email ?? 'N/A',
                        'amount' => $payment->amount,
                        'position' => $payment->vote->position->name ?? 'N/A',
                        'candidate' => $payment->vote->candidate->name ?? 'N/A',
                        'time' => $payment->created_at->diffForHumans(),
                        'status' => $payment->status,
                        'reference' => $payment->reference,
                    ];
                })->toArray();

            // Recent votes (last 10)
            $recentVotes = Vote::with(['candidate', 'position', 'payment'])
                ->where('payment_status', 'success')
                ->orderByDesc('created_at')
                ->limit(10)
                ->get()
                ->map(function ($vote) {
                    return [
                        'id' => $vote->id,
                        'candidate' => $vote->candidate->name,
                        'position' => $vote->position->name,
                        'vote_count' => $vote->vote_count,
                        'amount' => $vote->amount,
                        'voter_email' => $vote->payment->email ?? 'N/A',
                        'time' => $vote->created_at->diffForHumans(),
                    ];
                })->toArray();

            return [
                'cards' => [
                    'total_votes' => $totalVotes,
                    'total_revenue' => $totalRevenue,
                    'transactions' => $transactionsCount,
                    'church_vs_national' => [
                        'church_votes' => $churchVotes,
                        'national_votes' => $nationalVotes,
                    ],
                ],
                'last7Days' => $last7Days,
                'recent_transactions' => $recentTransactions,
                'recent_votes' => $recentVotes,
            ];
        });

        return response()->json($summary);
    }
}