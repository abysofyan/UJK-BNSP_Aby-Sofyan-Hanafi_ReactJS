import { useEffect, useState } from "react";
import { getBooks } from "../../../_services/books";
import { createTransaction } from "../../../_services/transactions";

const IMAGE_BASE_URL = "http://127.0.0.1:8000/storage/books/";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantities, setQuantities] = useState({});
    const [buyingId, setBuyingId] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("qris");

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getBooks();
                setBooks(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Gagal mengambil data buku:", err);
                setError(
                    "Data buku gagal dimuat. Pastikan server Laravel sedang berjalan.",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const filteredBooks = books.filter((book) =>
        book.title?.toLowerCase().includes(search.toLowerCase()),
    );

    const formatPrice = (price) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(Number(price));

    const handleQuantityChange = (bookId, value, stock) => {
        const quantity = Number(value);

        if (quantity < 1 || quantity > Number(stock)) {
            return;
        }

        setQuantities((prev) => ({
            ...prev,
            [bookId]: quantity,
        }));
    };


const handleBuy = (book) => {
    const quantity = quantities[book.id] || 1;

    if (quantity < 1 || quantity > Number(book.stock)) {
        alert("Jumlah pembelian melebihi stok yang tersedia.");
        return;
    }

    if (!localStorage.getItem("token")) {
        alert("Silakan login terlebih dahulu.");
        return;
    }

    setSelectedBook(book);
    setPaymentMethod("qris");
};

const confirmPurchase = async () => {
    if (!selectedBook) return;

    const book = selectedBook;
    const quantity = quantities[book.id] || 1;

    if (quantity < 1 || quantity > Number(book.stock)) {
        alert("Jumlah pembelian melebihi stok yang tersedia.");
        return;
    }

    try {
        setBuyingId(book.id);

        const response = await createTransaction(
            book.id,
            quantity,
            paymentMethod
        );

        setBooks((prevBooks) =>
            prevBooks.map((item) =>
                item.id === book.id
                    ? {
                          ...item,
                          stock: Number(item.stock) - quantity,
                      }
                    : item
            )
        );

        setQuantities((prev) => ({
            ...prev,
            [book.id]: 1,
        }));

        setSelectedBook(null);

        alert(
            `Transaksi berhasil!\n` +
            `Nomor pesanan: ${response.data?.order_number || "-"}\n` +
            `Metode pembayaran: ${paymentMethod.toUpperCase()}\n` +
            `Status pembayaran: Pending`
        );
    } catch (err) {
        console.error("Gagal membuat transaksi:", err);

        alert(
            err.response?.data?.message ||
                "Transaksi gagal. Silakan coba kembali."
        );
    } finally {
        setBuyingId(null);
    }
};

    return (
        <section className="min-h-screen bg-gray-50 py-10">
            <div className="mx-auto max-w-screen-xl px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
                        TemuBuku Store
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        Katalog Buku
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Temukan buku favoritmu dan mulai membaca hari ini.
                    </p>
                </div>

                {/* Search */}
                <div className="mx-auto mb-8 max-w-xl">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari judul buku..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                </div>

                {/* Loading */}
                {loading && (
                    <div className="py-16 text-center text-gray-600">
                        Sedang memuat katalog buku...
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center text-red-700">
                        {error}
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && books.length === 0 && (
                    <div className="rounded-lg bg-white p-10 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Belum ada buku
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Buku yang tersedia akan ditampilkan di sini.
                        </p>
                    </div>
                )}

                {/* Book List */}
                {!loading && !error && books.length > 0 && (
                    <>
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Semua Buku
                            </h2>

                            <p className="text-sm text-gray-500">
                                {filteredBooks.length} buku ditemukan
                            </p>
                        </div>

                        {filteredBooks.length === 0 ? (
                            <div className="rounded-lg bg-white p-10 text-center shadow-sm">
                                <p className="text-gray-600">
                                    Buku dengan judul "{search}" tidak
                                    ditemukan.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {filteredBooks.map((book) => (
                                    <div
                                        key={book.id}
                                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        {/* Cover */}
                                        <div className="flex h-64 items-center justify-center bg-gray-100 p-4">
                                            {book.cover_photo ? (
                                                <img
                                                    src={`${IMAGE_BASE_URL}${book.cover_photo}`}
                                                    alt={book.title}
                                                    className="h-full w-full object-contain"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="text-sm text-gray-400">
                                                    Sampul tidak tersedia
                                                </div>
                                            )}
                                        </div>

                                        {/* Book Information */}
                                        <div className="p-5">
                                            <h3 className="mb-2 line-clamp-2 min-h-12 text-lg font-bold text-gray-900">
                                                {book.title}
                                            </h3>

                                            <p className="mb-3 line-clamp-2 min-h-10 text-sm text-gray-500">
                                                {book.description ||
                                                    "Tidak ada deskripsi buku."}
                                            </p>

                                            <div className="mb-4 flex items-center justify-between">
                                                <span className="text-lg font-bold text-indigo-700">
                                                    {formatPrice(book.price)}
                                                </span>

                                                <span
                                                    className={`text-xs font-medium ${
                                                        Number(book.stock) > 0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {Number(book.stock) > 0
                                                        ? `Stok: ${book.stock}`
                                                        : "Stok habis"}
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Jumlah:
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={book.stock}
                                                        value={
                                                            quantities[
                                                                book.id
                                                            ] || 1
                                                        }
                                                        disabled={
                                                            Number(
                                                                book.stock,
                                                            ) <= 0
                                                        }
                                                        onChange={(e) =>
                                                            handleQuantityChange(
                                                                book.id,
                                                                e.target.value,
                                                                book.stock,
                                                            )
                                                        }
                                                        className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm"
                                                    />
                                                </div>

                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        Total:
                                                    </span>

                                                    <span className="font-bold text-indigo-700">
                                                        {formatPrice(
                                                            book.price *
                                                                (quantities[
                                                                    book.id
                                                                ] || 1),
                                                        )}
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        Number(book.stock) <=
                                                            0 ||
                                                        buyingId === book.id
                                                    }
                                                    onClick={() =>
                                                        handleBuy(book)
                                                    }
                                                    className="w-full rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                                                >
                                                    {buyingId === book.id
                                                        ? "Memproses..."
                                                        : Number(book.stock) <=
                                                            0
                                                          ? "Stok Habis"
                                                          : "Beli Sekarang"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

{/* MODAL PILIHAN PEMBAYARAN */}
{selectedBook && (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-4 sm:items-center">
        <div className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-xl font-bold text-gray-900">
                Pilih Metode Pembayaran
            </h2>

            <p className="mb-5 text-sm text-gray-600">
                Pilih metode pembayaran untuk menyelesaikan pesanan buku.
            </p>

            <div className="mb-5 rounded-lg bg-gray-50 p-4">
                <p className="font-semibold text-gray-900">
                    {selectedBook.title}
                </p>

                <div className="mt-2 flex justify-between text-sm text-gray-600">
                    <span>Jumlah buku</span>
                    <span>
                        {quantities[selectedBook.id] || 1}
                    </span>
                </div>

                <div className="mt-2 flex justify-between border-t border-gray-200 pt-3">
                    <span className="font-semibold text-gray-700">
                        Total pembayaran
                    </span>

                    <span className="font-bold text-indigo-700">
                        {formatPrice(
                            selectedBook.price *
                                (quantities[selectedBook.id] || 1)
                        )}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                        paymentMethod === "qris"
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200"
                    }`}
                >
                    <input
                        type="radio"
                        name="payment_method"
                        value="qris"
                        checked={paymentMethod === "qris"}
                        onChange={() => setPaymentMethod("qris")}
                        className="h-4 w-4 accent-indigo-600"
                    />

                    <div>
                        <p className="font-semibold text-gray-900">
                            QRIS
                        </p>
                        <p className="text-xs text-gray-500">
                            Pembayaran melalui QRIS.
                        </p>
                    </div>
                </label>

                <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                        paymentMethod === "cod"
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200"
                    }`}
                >
                    <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="h-4 w-4 accent-indigo-600"
                    />

                    <div>
                        <p className="font-semibold text-gray-900">
                            COD (Cash on Delivery)
                        </p>
                        <p className="text-xs text-gray-500">
                            Bayar ketika buku diterima.
                        </p>
                    </div>
                </label>
            </div>

            
{paymentMethod === "qris" && (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="mb-2 text-center font-semibold text-gray-900">
            Scan QRIS untuk Pembayaran
        </h3>

        <p className="mb-3 text-center text-xs text-gray-500">
            Gunakan GoPay atau aplikasi pembayaran lain
            yang mendukung QRIS.
        </p>

        <img
            src="/images/qris-booksales.png"
            alt="QRIS Pembayaran Booksales"
            className="mx-auto w-full max-w-xs rounded-lg object-contain"
        />

        <p className="mt-3 text-center text-sm font-semibold text-gray-800">
            Total: {formatPrice(
                selectedBook.price *
                (quantities[selectedBook.id] || 1)
            )}
        </p>

        <p className="mt-2 text-center text-xs text-gray-500">
            Pastikan nominal pembayaran sesuai dengan
            total pesanan sebelum melakukan pembayaran.
        </p>
    </div>
)}

            <div className="mt-6 flex gap-3">
                <button
                    type="button"
                    disabled={buyingId === selectedBook.id}
                    onClick={() => setSelectedBook(null)}
                    className="w-1/2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                    Batal
                </button>

                <button
                    type="button"
                    disabled={buyingId === selectedBook.id}
                    onClick={confirmPurchase}
                    className="w-1/2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                    {buyingId === selectedBook.id
                        ? "Memproses..."
                        : "Konfirmasi"}
                </button>
            </div>
        </div>
    </div>
)}

        </section>
    );
}
