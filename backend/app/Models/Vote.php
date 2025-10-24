<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_id', 'position_id', 'payment_reference', 'vote_count', 'amount', 'voter_phone', 'voter_email', 'payment_status', 'voted_at'
    ];

    protected $casts = [
        'voted_at' => 'datetime',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_reference', 'reference');
    }
}