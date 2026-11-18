import { useEffect, useState, } from "react";
import { Link } from "react-router-dom";
import { getGenres, deleteGenre } from "../../../_services/genres";

export default function AdminGenres() {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const fetchGenres = async () => {
    try {
        const data = await getGenres();
        setGenres(data || []);
        setError("");
    } catch (error) {
        console.log(error);
        setError("Gagal mengambil data genre.");
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    let ignore = false;

    const loadGenres = async () => {
        try {
            const data = await getGenres();

            if (!ignore) {
                setGenres(data || []);
                setError("");
            }
        } catch (error) {
            console.log(error);

            if (!ignore) {
                setError("Gagal mengambil data genre.");
            }
        } finally {
            if (!ignore) {
                setLoading(false);
            }
        }
    };

    loadGenres();

    return () => {
        ignore = true;
    };
}, []);

    const handleDelete = async (id, name) => {
        const confirmed = window.confirm(
            `Apakah kamu yakin ingin menghapus genre "${name}"?`
        );

        if (!confirmed) return;

        try {
            await deleteGenre(id);
            alert("Genre berhasil dihapus!");
            fetchGenres();
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                "Gagal menghapus genre."
            );
        }
    };

    // Filter genre berdasarkan nama dan deskripsi
    const filteredGenres = genres.filter((genre) => {
        const keyword = search.toLowerCase();

        return (
            genre.name?.toLowerCase().includes(keyword) ||
            genre.description?.toLowerCase().includes(keyword)
        );
    });

    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 min-h-screen">
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between p-4">
                    <div className="w-full">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Data Genres
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage your book genres
                        </p>

                        {/* Search */}
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau deskripsi genre..."
                            className="mt-4 w-full md:w-1/2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <Link
                        to="/admin/genres/create"
                        className="mt-3 md:mt-0 flex items-center justify-center text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-4 py-2"
                    >
                        <span className="mr-2">+</span>
                        Add Genre
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">No</th>
                                <th className="px-6 py-3">Genre Name</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-5 text-center">
                                        Loading data...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-5 text-center text-red-600">
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredGenres.length > 0 ? (
                                filteredGenres.map((genre, index) => (
                                    <tr
                                        key={genre.id}
                                        className="border-b dark:border-gray-700"
                                    >
                                        <td className="px-6 py-4">
                                            {index + 1}
                                        </td>

                                        <th className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {genre.name}
                                        </th>

                                        <td className="px-6 py-4">
                                            {genre.description || "-"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    to={`/admin/genres/edit/${genre.id}`}
                                                    className="text-white bg-yellow-500 hover:bg-yellow-600 font-medium rounded-lg text-xs px-3 py-2"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(genre.id, genre.name)}
                                                    className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-xs px-3 py-2"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-5 text-center">
                                        {search
                                            ? "Genre tidak ditemukan."
                                            : "Data genre belum tersedia."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Total Genre */}
                <div className="p-4 text-sm text-gray-500">
                    Total Genre: {genres.length}
                </div>

            </div>
        </section>
    );
}
