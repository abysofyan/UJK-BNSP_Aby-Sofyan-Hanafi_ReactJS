import API from "../_api";

// Mengambil semua akun
export const getUsers = async () => {
    const response = await API.get("/users");
    return response.data.data ?? [];
};

// Mengambil detail akun
export const getUser = async (id) => {
    const response = await API.get(`/users/${id}`);
    return response.data.data;
};

// Menghapus akun Customer
export const deleteUser = async (id) => {
    const response = await API.delete(`/users/${id}`);
    return response.data;
};
