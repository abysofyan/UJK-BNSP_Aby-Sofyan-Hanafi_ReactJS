
import { useJwt } from "react-jwt";
import API from "../_api";

export const login = async ({ email, password }) => {
    try {
        const { data } = await API.post("/login", { email, password });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const register = async ({ name, username, email, password }) => {
    try {
        const { data } = await API.post("/register", {
            name,
            username,
            email,
            password,
        });

        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const useDecodeToken = (token) => {
    const {
        decodedToken,
        isExpired,
        isInvalid,
        isDecoded
    } = useJwt(token || "");

    if (!token) {
        return {
            success: false,
            loading: false,
            message: "Token tidak ditemukan",
            data: null,
        };
    }

    // Tunggu sampai proses decoding selesai
    if (!isDecoded) {
        return {
            success: false,
            loading: true,
            message: "Memeriksa token...",
            data: null,
        };
    }

    if (isExpired || isInvalid || !decodedToken) {
        return {
            success: false,
            loading: false,
            message: "Token tidak valid atau expired",
            data: null,
        };
    }

    return {
        success: true,
        loading: false,
        message: "Token valid",
        data: decodedToken,
    };
};
