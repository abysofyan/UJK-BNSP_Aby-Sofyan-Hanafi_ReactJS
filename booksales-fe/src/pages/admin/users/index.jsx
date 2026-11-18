import { useEffect, useMemo, useState } from "react";
import {
    getUsers,
    deleteUser,
} from "../../../_services/users";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Mengambil data user pertama kali
    useEffect(() => {
        let ignore = false;

        getUsers()
            .then((data) => {
                if (!ignore) {
                    setUsers(data);
                    setError("");
                }
            })
            .catch((err) => {
                console.error("Gagal mengambil data users:", err);

                if (!ignore) {
                    setError(
                        err.response?.data?.message ||
                            "Gagal mengambil data pengguna."
                    );
                }
            })
            .finally(() => {
                if (!ignore) {
                    setLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    // Pencarian nama dan email
    const filteredUsers = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        return users.filter((user) => {
            return (
                user.name?.toLowerCase().includes(keyword) ||
                user.email?.toLowerCase().includes(keyword)
            );
        });
    }, [users, search]);

    // Format tanggal
    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Menghapus akun Customer
    const handleDelete = async (user) => {
        if (user.role?.toLowerCase() === "admin") {
            alert("Akun Admin tidak dapat dihapus.");
            return;
        }

        const confirmed = window.confirm(
            `Apakah kamu yakin ingin menghapus akun ${user.name}?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(user.id);

            await deleteUser(user.id);

            setUsers((prev) =>
                prev.filter((item) => item.id !== user.id)
            );

            if (selectedUser?.id === user.id) {
                setSelectedUser(null);
            }

            alert("Akun Customer berhasil dihapus.");
        } catch (err) {
            console.error("Gagal menghapus user:", err);

            alert(
                err.response?.data?.message ||
                    "Gagal menghapus akun. Silakan coba kembali."
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <section className="bg-gray-50 p-3 dark:bg-gray-900 sm:p-5">
            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">

                {/* HEADER */}
                <div className="p-5">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Manajemen Users
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Kelola dan lihat akun yang terdaftar di Booksales.
                    </p>

                    {/* RINGKASAN */}
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg bg-indigo-50 p-4">
                            <p className="text-sm text-indigo-600">
                                Total Pengguna
                            </p>
                            <p className="mt-1 text-2xl font-bold text-indigo-800">
                                {users.length}
                            </p>
                        </div>

                        <div className="rounded-lg bg-green-50 p-4">
                            <p className="text-sm text-green-600">
                                Customer
                            </p>
                            <p className="mt-1 text-2xl font-bold text-green-800">
                                {
                                    users.filter(
                                        (user) =>
                                            user.role?.toLowerCase() ===
                                            "customer"
                                    ).length
                                }
                            </p>
                        </div>

                        <div className="rounded-lg bg-orange-50 p-4">
                            <p className="text-sm text-orange-600">
                                Admin
                            </p>
                            <p className="mt-1 text-2xl font-bold text-orange-800">
                                {
                                    users.filter(
                                        (user) =>
                                            user.role?.toLowerCase() ===
                                            "admin"
                                    ).length
                                }
                            </p>
                        </div>
                    </div>

                    {/* SEARCH */}
                    <div className="mt-5">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau email pengguna..."
                            className="mt-4 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="p-8 text-center text-gray-500">
                        Memuat data pengguna...
                    </div>
                )}

                {/* ERROR */}
                {!loading && error && (
                    <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="ml-2 font-semibold underline"
                        >
                            Muat ulang
                        </button>
                    </div>
                )}

                {/* TABLE */}
                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-5 py-4">No.</th>
                                    <th className="px-5 py-4">Nama</th>
                                    <th className="px-5 py-4">Email</th>
                                    <th className="px-5 py-4">Role</th>
                                    <th className="px-5 py-4">Tanggal Registrasi</th>
                                    <th className="px-5 py-4">Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                                        >
                                            <td className="px-5 py-4">
                                                {index + 1}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                                                {user.name}
                                            </td>

                                            <td className="px-5 py-4">
                                                {user.email}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        user.role?.toLowerCase() === "admin"
                                                            ? "bg-orange-100 text-orange-700"
                                                            : "bg-green-100 text-green-700"
                                                    }`}
                                                >
                                                    {user.role || "-"}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                {formatDate(user.created_at)}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedUser(user)
                                                        }
                                                        className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                                                    >
                                                        Detail
                                                    </button>

                                                    {user.role?.toLowerCase() !== "admin" && (
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                deletingId === user.id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(user)
                                                            }
                                                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            {deletingId === user.id
                                                                ? "Menghapus..."
                                                                : "Hapus"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-5 py-10 text-center text-gray-500"
                                        >
                                            {search
                                                ? "Pengguna tidak ditemukan."
                                                : "Belum ada pengguna terdaftar."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TOTAL */}
                {!loading && !error && (
                    <div className="p-5 text-sm text-gray-500">
                        Menampilkan {filteredUsers.length} dari {users.length} pengguna.
                    </div>
                )}
            </div>

            {/* MODAL DETAIL */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <div className="my-auto w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                Detail Pengguna
                            </h2>

                            <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                                className="text-2xl text-gray-500 hover:text-gray-800"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500">Nama</p>
                                <p className="font-semibold text-gray-900">
                                    {selectedUser.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="font-semibold text-gray-900">
                                    {selectedUser.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Role</p>
                                <p className="font-semibold capitalize text-gray-900">
                                    {selectedUser.role}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Tanggal Registrasi</p>
                                <p className="font-semibold text-gray-900">
                                    {formatDate(selectedUser.created_at)}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedUser(null)}
                            className="mt-6 w-full rounded-lg bg-gray-200 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-300"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
