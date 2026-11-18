import { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../../_services/auth";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        setMessage("");

        if (formData.name.trim() === "") {
            setErrors({ name: ["Nama wajib diisi."] });
            return;
        }

        if (formData.username.trim() === "") {
            setErrors({ username: ["Username wajib diisi."] });
            return;
        }

        if (!/^[a-zA-Z0-9_-]{3,30}$/.test(formData.username)) {
            setErrors({
                username: [
                    "Username harus 3-30 karakter dan hanya menggunakan huruf, angka, - atau _.",
                ],
            });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setErrors({ email: ["Masukkan email yang valid."] });
            return;
        }

        if (formData.password.length < 8) {
            setErrors({
                password: ["Password minimal 8 karakter."],
            });
            return;
        }

        setLoading(true);

        try {
            const response = await register(formData);

            if (response.success) {
                setMessage(
                    "Registrasi berhasil! Silakan login menggunakan akun Anda."
                );

                setFormData({
                    name: "",
                    username: "",
                    email: "",
                    password: "",
                });
            }
        } catch (error) {
            const responseErrors = error.response?.data?.errors;

            if (responseErrors) {
                setErrors(responseErrors);
            } else {
                setMessage(
                    error.response?.data?.message ||
                    "Registrasi gagal. Silakan coba kembali."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10 dark:bg-gray-900">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-8">
                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                    Create an account
                </h1>

                <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                    Silakan isi data berikut untuk membuat akun baru.
                </p>

                {message && (
                    <div
                        className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700"
                        role="alert"
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Nama Lengkap
                        </label>

                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Masukkan nama lengkap"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="username"
                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Masukkan username"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                        />

                        {errors.username && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.username[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="nama@email.com"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimal 8 karakter"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password[0]}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Processing..." : "Create an account"}
                    </button>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                        >
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
}
