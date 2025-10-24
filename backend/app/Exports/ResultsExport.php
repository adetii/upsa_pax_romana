<?php

namespace App\Exports;

use App\Models\Candidate;
use App\Models\Vote;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ResultsExport implements FromCollection, WithHeadings
{
    public function __construct(
        protected ?int $categoryId = null,
        protected ?int $positionId = null,
    ) {}

    public function headings(): array
    {
        return [
            'Category',
            'Position',
            'Candidate Name',
            'Total Votes',
            'Total Revenue',
            'Transaction Count',
        ];
    }

    public function collection(): Collection
    {
        $query = Candidate::query()->with('position.category');
        if ($this->positionId) {
            $query->where('position_id', $this->positionId);
        } elseif ($this->categoryId) {
            $query->whereHas('position', fn($q) => $q->where('category_id', $this->categoryId));
        }

        $candidates = $query->get();

        return collect($candidates)->map(function ($candidate) {
            $votes = Vote::where('candidate_id', $candidate->id)->where('payment_status', 'success');
            $totalVotes = (int) $votes->sum('vote_count');
            $totalRevenue = (float) $votes->sum('amount');
            $transactions = (int) $votes->count();
            return [
                $candidate->position->category->name,
                $candidate->position->name,
                $candidate->name,
                $totalVotes,
                $totalRevenue,
                $transactions,
            ];
        });
    }
}