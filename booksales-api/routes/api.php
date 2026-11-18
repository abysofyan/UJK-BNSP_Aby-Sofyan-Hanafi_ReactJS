<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;

// ======================================
// AUTHENTICATION
// ======================================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:api');


// ======================================
// AUTHOR - PUBLIC ACCESS
// ======================================

Route::get('/authors', [AuthorController::class, 'index']);
Route::get('/authors/{id}', [AuthorController::class, 'show']);


// ======================================
// GENRE - PUBLIC ACCESS
// ======================================

Route::get('/genres', [GenreController::class, 'index']);
Route::get('/genres/{id}', [GenreController::class, 'show']);


// ======================================
// AUTHOR & GENRE - ADMIN ACCESS
// ======================================

Route::middleware(['auth:api', 'role:admin'])->group(function () {

    Route::post('/authors', [AuthorController::class, 'store']);
    Route::put('/authors/{id}', [AuthorController::class, 'update']);
    Route::delete('/authors/{id}', [AuthorController::class, 'destroy']);

    Route::post('/genres', [GenreController::class, 'store']);
    Route::put('/genres/{id}', [GenreController::class, 'update']);
    Route::delete('/genres/{id}', [GenreController::class, 'destroy']);

});


// ======================================
// TRANSACTION - CUSTOMER ACCESS
// ======================================

Route::middleware(['auth:api', 'role:customer'])->group(function () {

    // Create transaction
    Route::post('/transactions', [TransactionController::class, 'store']);

    // Riwayat transaksi customer
    Route::get('/my-transactions', [TransactionController::class, 'myTransactions']);

    // Konfirmasi pembayaran QRIS oleh customer
    Route::post(
    '/transactions/{id}/confirm-payment',
    [TransactionController::class, 'confirmPayment']);

    // Show transaction detail
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);

    // Update transaction
    Route::put('/transactions/{id}', [TransactionController::class, 'update']);

});


// ======================================
// TRANSACTION - ADMIN ACCESS
// ======================================

Route::middleware(['auth:api', 'role:admin'])->group(function () {

    // Dashboard
    Route::get('/admin/dashboard', [DashboardController::class, 'index']);

    // Read all transactions
    Route::get('/transactions', [TransactionController::class, 'index']);

    // Verifikasi pembayaran oleh admin
    Route::patch(
    '/transactions/{id}/payment-status',
    [TransactionController::class, 'updatePaymentStatus']
    );

    // Delete transaction
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);

});


// ======================================
// BOOK - PUBLIC ACCESS
// ======================================

Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);


// ======================================
// BOOK - CREATE, UPDATE & DELETE
// ======================================

Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::apiResource('/books', BookController::class)
        ->only(['store', 'update', 'destroy']);
});

// ======================================
// USER MANAGEMENT - ADMIN ACCESS
// ======================================

Route::middleware(['auth:api', 'role:admin'])->group(function () {

    // Menampilkan semua user
    Route::get('/users', [UserController::class, 'index']);

    // Detail user
    Route::get('/users/{id}', [UserController::class, 'show']);

    // Hapus akun customer
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

});
