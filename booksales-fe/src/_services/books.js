
import API from "../_api";

// Mengambil semua data buku
export const getBooks = async () => {
    const { data } = await API.get("/books");
    return data.data ?? [];
};

// Mengambil detail buku berdasarkan ID
export const getBook = async (id) => {
    const { data } = await API.get(`/books/${id}`);
    return data.data;
};

// Menambahkan buku
export const createBook = async (formData) => {
    const response = await API.post("/books", formData);
    return response.data;
};

// Mengubah data buku
export const updateBook = async (id, formData) => {
    const response = await API.post(`/books/${id}?_method=PUT`, formData);
    return response.data;
};

// Menghapus buku
export const deleteBook = async (id) => {
    const response = await API.delete(`/books/${id}`);
    return response.data;
};
