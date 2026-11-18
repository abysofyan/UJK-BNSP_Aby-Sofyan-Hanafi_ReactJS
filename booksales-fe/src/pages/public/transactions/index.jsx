import { useEffect, useState } from "react";
import {
    getMyTransactions,
    confirmPayment,
} from "../../../_services/transactions";

export default function MyTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [confirmingId, setConfirmingId] = useState(null);

    const fetchTransactions = async () => {
    try {
        const data = await getMyTransactions();
        setTransactions(data);
        setError("");
        } catch (err) {
            console.error("Gagal mengambil riwayat transaksi:", err);

            setError(
                err.response?.data?.message ||
                    "Riwayat transaksi gagal dimuat."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    let ignore = false;

    getMyTransactions()
        .then((data) => {
            if (!ignore) {
                setTransactions(data);
                setError("");
            }
        })
        .catch((err) => {
            console.error(
                "Gagal mengambil riwayat transaksi:",
                err
            );

            if (!ignore) {
                setError(
                    err.response?.data?.message ||
                        "Riwayat transaksi gagal dimuat."
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
    const formatPrice = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0);

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const handleConfirmPayment = async (transaction) => {
        const confirm = window.confirm(
            `Apakah kamu sudah membayar pesanan ${transaction.order_number} melalui QRIS?`
        );

        if (!confirm) return;

        try {
            setConfirmingId(transaction.id);

            await confirmPayment(transaction.id);

            alert(
                "Konfirmasi pembayaran berhasil dikirim. Silakan tunggu verifikasi Admin."
            );

            await fetchTransactions();
        } catch (err) {
            console.error("Gagal mengonfirmasi pembayaran:", err);

            alert(
                err.response?.data?.message ||
                    "Konfirmasi pembayaran gagal. Silakan coba kembali."
            );
        } finally {
            setConfirmingId(null);
        }
    };

    const getPaymentStatus = (status) => {
        const statuses = {
            pending: {
                label: "Belum Dibayar",
                className: "bg-yellow-100 text-yellow-700",
            },
            awaiting_verification: {
                label: "Menunggu Verifikasi",
                className: "bg-blue-100 text-blue-700",
            },
            paid: {
                label: "Lunas",
                className: "bg-green-100 text-green-700",
            },
            rejected: {
                label: "Pembayaran Ditolak",
                className: "bg-red-100 text-red-700",
            },
        };

        return statuses[status] || {
            label: status || "Belum Diketahui",
            className: "bg-gray-100 text-gray-700",
        };
    };

    const getOrderStatus = (status) => {
        const statuses = {
            pending: "Menunggu Diproses",
            processing: "Sedang Diproses",
            shipped: "Dalam Pengiriman",
            completed: "Selesai",
            cancelled: "Dibatalkan",
        };

        return statuses[status] || status || "-";
    };

    return (
        <section className="min-h-screen bg-gray-50 py-10">
            <div className="mx-auto max-w-screen-xl px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Riwayat Transaksi
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Daftar pembelian buku yang pernah kamu lakukan.
                    </p>
                </div>

                {loading && (
                    <div className="rounded-lg bg-white p-8 text-center">
                        Memuat riwayat transaksi...
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                                    <tr>
                                        <th className="px-5 py-4">No.</th>
                                        <th className="px-5 py-4">Order Number</th>
                                        <th className="px-5 py-4">Nama Buku</th>
                                        <th className="px-5 py-4">Jumlah</th>
                                        <th className="px-5 py-4">Total</th>
                                        <th className="px-5 py-4">Metode</th>
                                        <th className="px-5 py-4">Pembayaran</th>
                                        <th className="px-5 py-4">Status Pesanan</th>
                                        <th className="px-5 py-4">Tanggal</th>
                                        <th className="px-5 py-4">Aksi</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions.length > 0 ? (
                                        transactions.map((transaction, index) => {
                                            const payment = getPaymentStatus(
                                                transaction.payment_status
                                            );

                                            const canConfirm =
                                                transaction.payment_method === "qris" &&
                                                ["pending", "rejected"].includes(
                                                    transaction.payment_status
                                                );

                                            return (
                                                <tr
                                                    key={transaction.id}
                                                    className="border-b hover:bg-gray-50"
                                                >
                                                    <td className="px-5 py-4">
                                                        {index + 1}
                                                    </td>

                                                    <td className="px-5 py-4 font-medium text-gray-900">
                                                        {transaction.order_number}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        {transaction.book?.title ||
                                                            "Buku tidak tersedia"}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        {transaction.quantity}
                                                    </td>

                                                    <td className="px-5 py-4 font-semibold text-indigo-700">
                                                        {formatPrice(
                                                            transaction.total_amount
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 font-medium uppercase">
                                                        {transaction.payment_method || "-"}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${payment.className}`}
                                                        >
                                                            {payment.label}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        {getOrderStatus(
                                                            transaction.order_status
                                                        )}
                                                        {transaction.payment_method === "cod" &&
                                                            transaction.payment_status !== "paid" && (
                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    Bayar saat buku diterima
                                                                </p>
                                                            )}
                                                    </td>

                                                    <td className="px-5 py-4 whitespace-nowrap">
                                                        {formatDate(
                                                            transaction.created_at
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        {canConfirm ? (
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    confirmingId === transaction.id
                                                                }
                                                                onClick={() =>
                                                                    handleConfirmPayment(
                                                                        transaction
                                                                    )
                                                                }
                                                                className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                                                            >
                                                                {confirmingId === transaction.id
                                                                    ? "Mengirim..."
                                                                    : "Saya Sudah Bayar"}
                                                            </button>
                                                        ) : transaction.payment_method === "qris" &&
                                                          transaction.payment_status === "awaiting_verification" ? (
                                                            <span className="text-xs text-blue-600">
                                                                Menunggu Admin
                                                            </span>
                                                        ) : transaction.payment_status === "paid" ? (
                                                            <span className="text-xs font-semibold text-green-600">
                                                                Terverifikasi
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="10"
                                                className="px-5 py-10 text-center text-gray-500"
                                            >
                                                Kamu belum memiliki transaksi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <p className="mt-4 text-sm text-gray-500">
                            Total transaksi: {transactions.length}
                        </p>
                    </>
                )}
            </div>
        </section>
    );
}
