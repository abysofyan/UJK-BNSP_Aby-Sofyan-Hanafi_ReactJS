import { useEffect, useState } from "react";
import { getDashboard } from "../../_services/dashboard";

export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        getDashboard()
            .then((data) => {
                if (!ignore) {
                    setDashboard(data);
                    setError("");
                }
            })
            .catch((err) => {
                console.error("Gagal mengambil dashboard:", err);

                if (!ignore) {
                    setError(
                        err.response?.data?.message ||
                        "Gagal memuat data dashboard."
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

    const summary = dashboard?.summary;

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value || 0);
    };

    const cards = [
        {
            title: "Total Pengguna",
            value: summary?.total_users ?? 0,
            description: `${summary?.total_customers ?? 0} Customer`,
            icon: "users",
            color: "bg-indigo-100 text-indigo-700",
        },
        {
            title: "Total Buku",
            value: summary?.total_books ?? 0,
            description: "Buku terdaftar",
            icon: "book",
            color: "bg-green-100 text-green-700",
        },
        {
            title: "Total Transaksi",
            value: summary?.total_transactions ?? 0,
            description: "Seluruh transaksi",
            icon: "shopping-cart",
            color: "bg-orange-100 text-orange-700",
        },
        {
            title: "Total Pendapatan",
            value: formatRupiah(summary?.total_revenue),
            description: "Dari pembayaran lunas",
            icon: "wallet",
            color: "bg-teal-100 text-teal-700",
        },
    ];

    const salesChart = dashboard?.sales_chart ?? [];

    const maxSales = Math.max(
        ...salesChart.map((item) => Number(item.total)),
        1
    );

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-400">
                Memuat dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
                <p className="font-semibold">Dashboard gagal dimuat</p>
                <p className="mt-1 text-sm">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                    Muat Ulang
                </button>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gray-900 p-4 sm:p-6">
            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">
                    Dashboard TemuBuku
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                    Selamat datang di halaman Admin TemuBuku.
                    Berikut ringkasan aktivitas toko buku.
                </p>
            </div>

            {/* RINGKASAN */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="rounded-xl border border-gray-700 bg-gray-800 p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-400">
                                {card.title}
                            </p>

                            <div className={`rounded-lg p-3 ${card.color}`}>
                                {card.icon === "users" && (
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.5-1.7M9 20H4v-2a3 3 0 015.5-1.7M15 20v-2a3 3 0 00-6 0v2m6-11a3 3 0 11-6 0 3 3 0 016 0zm6 2a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}

                                {card.icon === "book" && (
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v14m0-14C10.5 5.7 8.5 5 6 5S2 5.7 2 7v14c0-1.3 2-2 4-2s4 .7 6 2m0-14c1.5-1.3 3.5-2 6-2s4 .7 4 2v14c0-1.3-2-2-4-2s-4 .7-6 2" />
                                    </svg>
                                )}

                                {card.icon === "shopping-cart" && (
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l2.4 12.2a2 2 0 002 1.8h8.7a2 2 0 002-1.6L22 8H6m4 13a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                                    </svg>
                                )}

                                {card.icon === "wallet" && (
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v12H5a2 2 0 01-2-2V7zm0 2h18m-5 4h2" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-white">
                            {card.value}
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* PEMBAYARAN MENUNGGU */}
            <div className="mt-5 rounded-xl border border-yellow-700 bg-yellow-900/30 p-5">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-yellow-200">
                            Pembayaran Menunggu Verifikasi
                        </p>
                        <p className="mt-1 text-sm text-yellow-300">
                            QRIS yang perlu diperiksa oleh Admin.
                        </p>
                    </div>

                    <div className="text-3xl font-bold text-yellow-300">
                        {summary?.pending_payments ?? 0}
                    </div>
                </div>
            </div>

            {/* GRAFIK PENJUALAN */}
            <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800 p-5 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-white">
                        Statistik Transaksi
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Jumlah transaksi selama 7 hari terakhir.
                    </p>
                </div>

                <div className="flex h-56 items-end justify-around gap-3 border-b border-gray-700 px-2">
                    {salesChart.map((item) => (
                        <div
                            key={item.date}
                            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                        >
                            <span className="text-xs font-semibold text-gray-300">
                                {item.total}
                            </span>

                            <div
                                className="w-full max-w-12 rounded-t-md bg-indigo-500 transition-all hover:bg-indigo-600"
                                style={{
                                    height: `${Math.max(
                                        (Number(item.total) / maxSales) * 75,
                                        item.total > 0 ? 4 : 0
                                    )}%`,
                                }}
                                title={`${item.total} transaksi`}
                            />

                            <span className="text-xs text-gray-400">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* TRANSAKSI TERBARU DAN STOK */}
            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* TRANSAKSI TERBARU */}
                <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-sm">
                    <div className="border-b border-gray-700 p-5">
                        <h2 className="text-lg font-bold text-white">
                            Transaksi Terbaru
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">
                            Lima transaksi terakhir di TemuBuku.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-700 text-xs uppercase text-gray-300">
                                <tr>
                                    <th className="px-4 py-3">Order</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dashboard?.recent_transactions?.length > 0 ? (
                                    dashboard.recent_transactions.map((transaction) => (
                                        <tr key={transaction.id} className="border-t border-gray-700">
                                            <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                                                {transaction.order_number}
                                            </td>
                                            <td className="px-4 py-3 text-gray-300">
                                                {transaction.user?.name || "-"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-gray-200">
                                                {formatRupiah(transaction.total_amount)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    transaction.payment_status === "paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : transaction.payment_status === "awaiting_verification"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : transaction.payment_status === "rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-700 text-gray-200"
                                                }`}>
                                                    {transaction.payment_status === "paid"
                                                        ? "Lunas"
                                                        : transaction.payment_status === "awaiting_verification"
                                                        ? "Menunggu"
                                                        : transaction.payment_status === "rejected"
                                                        ? "Ditolak"
                                                        : "Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                                            Belum ada transaksi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* STOK BUKU MENIPIS */}
                <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-sm">
                    <div className="border-b border-gray-700 p-5">
                        <h2 className="text-lg font-bold text-white">
                            Stok Buku Menipis
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">
                            Buku dengan stok 5 atau kurang.
                        </p>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {dashboard?.low_stock_books?.length > 0 ? (
                            dashboard.low_stock_books.map((book) => (
                                <div
                                    key={book.id}
                                    className="flex items-center justify-between gap-3 p-4"
                                >
                                    <div>
                                        <p className="font-medium text-white">
                                            {book.title}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            ID Buku: {book.id}
                                        </p>
                                    </div>

                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        book.stock === 0
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                        Stok: {book.stock}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400">
                                <p className="font-medium">
                                    Semua stok buku aman.
                                </p>
                                <p className="mt-1 text-xs">
                                    Belum ada buku dengan stok 5 atau kurang.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
