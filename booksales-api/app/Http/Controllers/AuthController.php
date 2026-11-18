<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

public function register(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'username' => 'required|string|min:3|max:30|alpha_dash|unique:users,username',
        'email' => 'required|email|max:255|unique:users,email',
        'password' => 'required|string|min:8',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    $user = User::create([
        'name' => $request->name,
        'username' => $request->username,
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'role' => 'customer',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Registration successful',
        'data' => $user
    ], 201);
}

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = Auth::guard('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'user' => Auth::guard('api')->user(),
            'token' => $token
        ], 200);
    }

    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil'
        ], 200);
    }
}
