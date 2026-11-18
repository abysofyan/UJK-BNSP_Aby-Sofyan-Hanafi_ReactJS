<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transactions';

    protected $fillable = [
        'order_number',
        'customer_id',
        'book_id',
        'quantity',
        'total_amount',
        'payment_method',
        'payment_status',
        'order_status',
    ];

    // Relasi transaksi dengan User
    public function user()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    // Relasi transaksi dengan Book
    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }
}
