<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Book;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. RINGKASAN DATA
        $totalUsers = User::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $totalAdmins = User::where('role', 'admin')->count();

        $totalBooks = Book::count();
        $totalTransactions = Transaction::count();

        // Pendapatan hanya dari transaksi yang sudah lunas
        $totalRevenue = Transaction::where(
            'payment_status',
            'paid'
        )->sum('total_amount');

        // 2. GRAFIK TRANSAKSI 7 HARI TERAKHIR
        $startDate = Carbon::today()->subDays(6);
        $endDate = Carbon::today()->endOfDay();

        $salesData = Transaction::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as total')
        )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->pluck('total', 'date');

        $salesChart = collect(range(6, 0))->map(function ($day) use ($salesData) {
            $date = Carbon::today()->subDays($day);

            return [
                'date' => $date->format('Y-m-d'),
                'label' => $date->translatedFormat('D'),
                'total' => (int) ($salesData[$date->format('Y-m-d')] ?? 0),
            ];
        });

        // 3. TRANSAKSI TERBARU
        $recentTransactions = Transaction::with(['user', 'book'])
            ->latest()
            ->take(5)
            ->get();

        // 4. BUKU DENGAN STOK MENIPIS (5 ATAU KURANG)
        $lowStockBooks = Book::select(
            'id',
            'title',
            'stock'
        )
            ->where('stock', '<=', 5)
            ->orderBy('stock')
            ->take(5)
            ->get();

        // 5. PEMBAYARAN MENUNGGU VERIFIKASI
        $pendingPayments = Transaction::where(
            'payment_status',
            'awaiting_verification'
        )->count();

        return response()->json([
            'success' => true,
            'message' => 'Dashboard data berhasil diambil.',
            'data' => [
                'summary' => [
                    'total_users' => $totalUsers,
                    'total_customers' => $totalCustomers,
                    'total_admins' => $totalAdmins,
                    'total_books' => $totalBooks,
                    'total_transactions' => $totalTransactions,
                    'total_revenue' => (float) $totalRevenue,
                    'pending_payments' => $pendingPayments,
                ],
                'sales_chart' => $salesChart,
                'recent_transactions' => $recentTransactions,
                'low_stock_books' => $lowStockBooks,
            ],
        ], 200);
    }
}
