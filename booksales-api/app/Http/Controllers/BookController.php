<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::all();

        if ($books->isEmpty()) {
            return response()->json([
                "success" => true,
                "message" => "Resources data not found!"
            ], 200);
        }

        return response()->json([
            "success" => true,
            "message" => "Get all resources",
            "data" => $books
        ], 200);
    }

    public function store(Request $request)
    {
        // 1. validator
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:100',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'cover_photo' => 'required|image|mimes:jpeg,jpg,png|max:2048',
            'genre_id' => 'required|exists:genres,id',
            'author_id' => 'required|exists:authors,id'
        ]);

        // 2. check validator error
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        // 3. upload image
        $image = $request->file('cover_photo');
        $image->store('books', 'public');

        // 4. insert data
        $book = Book::create([
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'cover_photo' => $image->hashName(),
            'genre_id' => $request->genre_id,
            'author_id' => $request->author_id,
        ]);

        // 5. response

        return response()->json([
            'success' => true,
            'message' => 'Resource added succesfully!',
            'data' => $book
        ], 201);
    }

    public function show(string $id) {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'succsess' => false,
                'mesage' =>'Resource not found',
            ], 404);
        }

        return response()->json([
            'succsess' => true,
            'mesage' =>'Get detail resource',
            'data' => $book
        ], 200);
    }


public function update(Request $request, string $id) {
    // 1. mencari data
    $book = Book::find($id);

    if (!$book) {
        return response()->json([
            'succsess' => false,
            'mesage' =>'Resource not found',
        ], 404);
    }

    // 2. validator
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:100',
        'description' => 'required|string',
        'price' => 'required|numeric',
        'stock' => 'required|integer',
        'cover_photo' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        'genre_id' => 'required|exists:genres,id',
        'author_id' => 'required|exists:authors,id'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()
        ], 422);
    }

    // 3. siapkan data yang ingin diupdaate
    $data = [
        'title' => $request->title,
        'description' => $request->description,
        'price' => $request->price,
        'stock' => $request->stock,
        'genre_id' => $request->genre_id,
        'author_id' => $request->author_id,
    ];

    // 4. handle image (upload & delete image)
    if ($request->hasFile('cover_photo')) {
        $image = $request->file('cover_photo');
        $image->store('books', 'public');

        if ($book->cover_photo) {
            Storage::disk('public')->delete('books/' . $book->cover_photo);
        }

        $data['cover_photo'] = $image->hashName();
    }

    // 5. update data baru ke database
    $book->update($data);

    return response()->json([
             'success' => true,
             'message' => 'Resource updated succesfully!',
             'data' => $book
        ], 200);
    }

   public function destroy(string $id)
{
    $book = Book::find($id);

    if (!$book) {
        return response()->json([
            'success' => false,
            'message' => 'Book not found',
        ], 404);
    }

    // Cek apakah buku memiliki transaksi
    if ($book->transactions()->exists()) {
        return response()->json([
            'success' => false,
            'message' => 'Book cannot be deleted because it has transaction history',
        ], 409);
    }

    // Hapus gambar sampul
    if ($book->cover_photo) {
        Storage::disk('public')->delete('books/' . $book->cover_photo);
    }

    // Hapus data buku
    $book->delete();

    return response()->json([
        'success' => true,
        'message' => 'Book deleted successfully',
    ], 200);
}

}
