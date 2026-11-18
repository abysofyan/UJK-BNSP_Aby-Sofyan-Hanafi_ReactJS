import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthors, deleteAuthor } from "../../../_services/authors";

export default function AdminAuthors() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const fetchAuthors = async () => {
        try {
            const data = await getAuthors();
            setAuthors(data || []);
            setError("");
        } catch (error) {
            console.log(error);
            setError("Gagal mengambil data author.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let ignore = false;

        const loadAuthors = async () => {
            try {
                const data = await getAuthors();

                if (!ignore) {
                    setAuthors(data || []);
                    setError("");
                }
            } catch (error) {
                console.log(error);

                if (!ignore) {
                    setError("Gagal mengambil data author.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadAuthors();

        return () => {
            ignore = true;
        };
    }, []);

    const handleDelete = async (id, name) => {
        const confirmed = window.confirm(
            `Apakah kamu yakin ingin menghapus author "${name}"?`
        );

        if (!confirmed) return;

        try {
            await deleteAuthor(id);
            alert("Author berhasil dihapus!");
            fetchAuthors();
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                "Gagal menghapus author."
            );
        }
    };

    // Filter author berdasarkan nama dan biography
    const filteredAuthors = authors.filter((author) => {
        const keyword = search.toLowerCase();

        return (
            author.name?.toLowerCase().includes(keyword) ||
            author.bio?.toLowerCase().includes(keyword)
        );
    });

    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 min-h-screen">
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between p-4">
                    <div className="w-full">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Data Authors
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage your book authors
                        </p>

                        {/* Search */}
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau biography author..."
                            className="mt-4 w-full md:w-1/2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <Link
                        to="/admin/authors/create"
                        className="mt-3 md:mt-0 flex items-center justify-center text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-4 py-2"
                    >
                        <span className="mr-2">+</span>
                        Add Author
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">No</th>
                                <th className="px-6 py-3">Photo</th>
                                <th className="px-6 py-3">Author Name</th>
                                <th className="px-6 py-3">Biography</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-5 text-center">
                                        Loading data...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-5 text-center text-red-600">
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredAuthors.length > 0 ? (
                                filteredAuthors.map((author, index) => (
                                    <tr
                                        key={author.id}
                                        className="border-b dark:border-gray-700"
                                    >
                                        <td className="px-6 py-4">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4">
                                            {author.photo ? (
                                                <img
                                                    src={`http://127.0.0.1:8000/storage/authors/${author.photo}`}
                                                    alt={author.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span>No photo</span>
                                            )}
                                        </td>

                                        <th className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {author.name}
                                        </th>

                                        <td className="px-6 py-4">
                                            {author.bio || "-"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    to={`/admin/authors/edit/${author.id}`}
                                                    className="text-white bg-yellow-500 hover:bg-yellow-600 font-medium rounded-lg text-xs px-3 py-2"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(author.id, author.name)}
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
                                    <td colSpan="5" className="px-6 py-5 text-center">
                                        {search
                                            ? "Author tidak ditemukan."
                                            : "Data author belum tersedia."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Total Authors */}
                <div className="p-4 text-sm text-gray-500">
                    Total Authors: {authors.length}
                </div>

            </div>
        </section>
    );
}
