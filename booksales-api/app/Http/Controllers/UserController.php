<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // MENAMPILKAN SEMUA USER
    public function index()
    {
        $users = User::select(
            'id',
            'name',
            'email',
            'role',
            'created_at'
        )
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Data users berhasil diambil.',
            'data' => $users,
        ], 200);
    }

    // DETAIL USER
    public function show(string $id)
    {
        $user = User::select(
            'id',
            'name',
            'email',
            'role',
            'created_at'
        )->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail user berhasil diambil.',
            'data' => $user,
        ], 200);
    }

    // HAPUS AKUN CUSTOMER
    public function destroy(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        // Akun Admin tidak boleh dihapus melalui fitur ini
        if ($user->role === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Akun Admin tidak boleh dihapus.',
            ], 403);
        }

        // Jangan hapus akun yang masih memiliki transaksi
        $hasTransactions = Transaction::where(
            'customer_id',
            $user->id
        )->exists();

        if ($hasTransactions) {
            return response()->json([
                'success' => false,
                'message' => 'Akun tidak dapat dihapus karena masih memiliki riwayat transaksi.',
            ], 409);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun Customer berhasil dihapus.',
        ], 200);
    }
}
