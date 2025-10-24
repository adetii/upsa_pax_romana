<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'amount', 'status', 'email', 'phone', 'metadata', 'paystack_response'
    ];

    protected $casts = [
        'metadata' => 'array',
        'paystack_response' => 'array',
    ];

    /**
     * Get the vote associated with this payment
     */
    public function vote()
    {
        return $this->hasOne(Vote::class, 'payment_reference', 'reference');
    }
}