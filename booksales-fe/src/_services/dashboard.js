
import API from "../_api";

// Mengambil data Dashboard Admin
export const getDashboard = async () => {
    const response = await API.get("/admin/dashboard");
    return response.data.data;
};
