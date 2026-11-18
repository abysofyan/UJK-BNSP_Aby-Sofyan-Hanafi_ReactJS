import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBook, updateBook } from "../../../_services/books";
import { getGenres } from "../../../_services/genres";
import { getAuthors } from "../../../_services/authors";

const IMAGE_BASE_URL = "http://127.0.0.1:8000/storage/books/";

export default function BookEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [genres, setGenres] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        stock: "",
        genre_id: "",
        author_id: "",
        description: "",
        cover_photo: null,
    });

    const [currentCover, setCurrentCover] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [book, genresData, authorsData] = await Promise.all([
                    getBook(id),
                    getGenres(),
                    getAuthors(),
                ]);

                setFormData({
                    title: book.title ?? "",
                    price: book.price ?? "",
                    stock: book.stock ?? "",
                    genre_id: String(book.genre_id ?? ""),
                    author_id: String(book.author_id ?? ""),
                    description: book.description ?? "",
                    cover_photo: null,
                });

                setCurrentCover(book.cover_photo ?? "");
                setGenres(genresData ?? []);
                setAuthors(authorsData ?? []);
            } catch (err) {
                console.error(err);
                setError("Gagal mengambil data buku.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: name === "cover_photo" ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            const payload = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === "cover_photo") {
                    if (value) payload.append(key, value);
                } else {
                    payload.append(key, value);
                }
            });

            await updateBook(id, payload);
            alert("Buku berhasil diperbarui!");
            navigate("/admin/books");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message
                    ? JSON.stringify(err.response.data.message)
                    : "Gagal memperbarui buku."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500";

    const labelClass =
        "mb-2 block text-sm font-medium text-white";

    if (loading) {
        return (
            <div className="bg-gray-900 p-8 text-center text-white">
                Memuat data buku...
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gray-900">
            <div className="mx-auto max-w-2xl px-4 py-8 lg:py-16">
                <h2 className="mb-6 text-2xl font-bold text-white">
                    Edit Buku
                </h2>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-900/50 p-4 text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">

                        <div className="sm:col-span-2">
                            <label className={labelClass}>
                                Judul Buku
                            </label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Harga
                            </label>
                            <input
                                type="number"
                                name="price"
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Stok
                            </label>
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Genre
                            </label>
                            <select
                                name="genre_id"
                                value={formData.genre_id}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            >
                                <option value="">Pilih Genre</option>
                                {genres.map((genre) => (
                                    <option key={genre.id} value={genre.id}>
                                        {genre.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>
                                Author
                            </label>
                            <select
                                name="author_id"
                                value={formData.author_id}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            >
                                <option value="">Pilih Author</option>
                                {authors.map((author) => (
                                    <option key={author.id} value={author.id}>
                                        {author.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className={labelClass}>
                                Sampul Saat Ini
                            </label>

                            {currentCover && (
                                <img
                                    src={`${IMAGE_BASE_URL}${currentCover}`}
                                    alt="Sampul buku saat ini"
                                    className="mb-3 h-48 rounded-lg object-contain"
                                />
                            )}

                            <label className={labelClass}>
                                Ganti Sampul (Opsional)
                            </label>
                            <input
                                type="file"
                                name="cover_photo"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={handleChange}
                                className={`${inputClass} file:mr-4 file:rounded-md file:border-0 file:bg-gray-600 file:px-4 file:py-2 file:text-white`}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className={labelClass}>
                                Deskripsi
                            </label>
                            <textarea
                                name="description"
                                rows="5"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-indigo-700 px-5 py-2.5 text-white transition hover:bg-indigo-800 disabled:opacity-50"
                        >
                            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/admin/books")}
                            className="rounded-lg border border-gray-600 px-5 py-2.5 text-gray-300 transition hover:bg-gray-700 hover:text-white"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
