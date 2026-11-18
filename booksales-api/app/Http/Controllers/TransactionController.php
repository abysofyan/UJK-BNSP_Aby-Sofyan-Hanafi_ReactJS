<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    // READ ALL TRANSACTIONS
    public function index()
    {
        $transactions = Transaction::with(['user', 'book'])->get();

        if ($transactions->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'Resources transaction not found!',
            ], 200);
        }

        return response()->json([
            'success' => true,
            'message' => 'Get all resources transaction',
            'data' => $transactions,
        ], 200);
    }


// RIWAYAT TRANSAKSI CUSTOMER
public function myTransactions()
{
    $user = auth('api')->user();

    $transactions = Transaction::with('book')
        ->where('customer_id', $user->id)
        ->latest()
        ->get();

    return response()->json([
        'success' => true,
        'message' => 'Get customer transaction history',
        'data' => $transactions,
    ], 200);
}


    // SHOW TRANSACTION DETAIL
    public function show(string $id)
    {
        $user = auth('api')->user();

$transaction = Transaction::with(['user', 'book'])
    ->where('customer_id', $user->id)
    ->find($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Get detail resource',
            'data' => $transaction
        ], 200);
    }


    // CREATE TRANSACTION
    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:qris,cod',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'data' => $validated->errors()
            ], 422);
        }

        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized!'
            ], 401);
        }

        $data = $validated->validated();

        $uniqueCode = 'ORD-' . strtoupper(uniqid());

        $transaction = DB::transaction(function () use (
            $data,
            $user,
            $uniqueCode
        ) {
            $book = Book::whereKey($data['book_id'])
                ->lockForUpdate()
                ->first();

            if (!$book || $book->stock < $data['quantity']) {
                return null;
            }

            $totalAmount = $book->price * $data['quantity'];

            // Kurangi stok buku
            $book->stock -= $data['quantity'];
            $book->save();

            // Simpan transaksi
            return Transaction::create([
                'order_number' => $uniqueCode,
                'customer_id' => $user->id,
                'book_id' => $data['book_id'],
                'quantity' => $data['quantity'],
                'total_amount' => $totalAmount,
                'payment_method' => $data['payment_method'],
                'payment_status' => 'pending',
                'order_status' => 'pending',
            ]);
        });

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Stock barang tidak cukup!'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaction created successfully',
            'data' => $transaction->load(['user', 'book'])
        ], 201);
    }


    // CUSTOMER CONFIRM PAYMENT
    public function confirmPayment(string $id)
    {
        $user = auth('api')->user();

        $transaction = Transaction::where('id', $id)
            ->where('customer_id', $user->id)
            ->first();

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found'
            ], 404);
        }

        if ($transaction->payment_method !== 'qris') {
            return response()->json([
                'success' => false,
                'message' => 'Konfirmasi ini hanya untuk pembayaran QRIS.'
            ], 422);
        }

        if (!in_array($transaction->payment_status, ['pending', 'rejected'])) {
            return response()->json([
                'success' => false,
                'message' => 'Pembayaran sudah dikonfirmasi atau sedang diperiksa.'
            ], 422);
        }

        $transaction->update([
            'payment_status' => 'awaiting_verification'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Konfirmasi pembayaran berhasil dikirim. Menunggu verifikasi admin.',
            'data' => $transaction->fresh()
        ], 200);
    }


    // ADMIN VERIFY PAYMENT
    public function updatePaymentStatus(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'payment_status' => 'required|in:paid,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'data' => $validator->errors()
            ], 422);
        }

        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found'
            ], 404);
        }

        if ($transaction->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Pembayaran sudah lunas.'
            ], 422);
        }

        if (
            $transaction->payment_method === 'qris' &&
            $transaction->payment_status !== 'awaiting_verification'
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Pembayaran QRIS belum dikonfirmasi Customer.'
            ], 422);
        }

        $newStatus = $validator->validated()['payment_status'];

        $transaction->update([
            'payment_status' => $newStatus,
            'order_status' => $newStatus === 'paid'
                ? 'processing'
                : 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => $newStatus === 'paid'
                ? 'Pembayaran berhasil diverifikasi.'
                : 'Pembayaran ditolak.',
            'data' => $transaction->fresh(['user', 'book'])
        ], 200);
    }


    // UPDATE TRANSACTION
    public function update(Request $request, string $id)
    {
        $user = auth('api')->user();

$transaction = Transaction::where('customer_id', $user->id)
    ->find($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found'
            ], 404);
        }

        $validated = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'data' => $validated->errors()
            ], 422);
        }

        $newBook = Book::find($request->book_id);
        $oldBook = Book::find($transaction->book_id);

        if (!$oldBook || !$newBook) {
            return response()->json([
                'success' => false,
                'message' => 'Book resource not found'
            ], 404);
        }

        // Jika buku tetap sama, stok lama dikembalikan
        // untuk menghitung ketersediaan stok yang sebenarnya.
        if ($oldBook->id == $newBook->id) {
            $availableStock = $newBook->stock + $transaction->quantity;
        } else {
            $availableStock = $newBook->stock;
        }

        if ($availableStock < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Stock barang tidak cukup!'
            ], 400);
        }

        $totalAmount = $newBook->price * $request->quantity;

        DB::transaction(function () use (
            $transaction,
            $oldBook,
            $newBook,
            $request,
            $totalAmount
        ) {
            if ($oldBook->id == $newBook->id) {
                $newBook->stock =
                    $newBook->stock
                    + $transaction->quantity
                    - $request->quantity;

                $newBook->save();
            } else {
                // Kembalikan stok buku sebelumnya
                $oldBook->stock += $transaction->quantity;
                $oldBook->save();

                // Kurangi stok buku yang baru
                $newBook->stock -= $request->quantity;
                $newBook->save();
            }

            $transaction->update([
                'book_id' => $request->book_id,
                'quantity' => $request->quantity,
                'total_amount' => $totalAmount,
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Transaction updated successfully',
            'data' => $transaction->fresh(['user', 'book'])
        ], 200);
    }

    // DELETE TRANSACTION
    public function destroy(string $id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found'
            ], 404);
        }

        $book = Book::find($transaction->book_id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Book resource not found'
            ], 404);
        }

        DB::transaction(function () use ($transaction, $book) {

            // Kembalikan stok buku
            $book->stock += $transaction->quantity;
            $book->save();

            // Hapus transaksi
            $transaction->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Transaction deleted successfully'
        ], 200);
    }
}
