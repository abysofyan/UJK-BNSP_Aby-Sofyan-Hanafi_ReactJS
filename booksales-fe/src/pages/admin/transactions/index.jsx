import { useEffect, useState } from "react";
import {
    getTransactions,
    updatePaymentStatus,
} from "../../../_services/transactions";

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchTransactions = async () => {
    try {
        const data = await getTransactions();
        setTransactions(data);
        setError("");
        } catch (err) {
            console.error("Gagal mengambil transaksi:", err);
            setError(
                err.response?.data?.message ||
                    "Gagal mengambil data transaksi."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    let ignore = false;

    getTransactions()
        .then((data) => {
            if (!ignore) {
                setTransactions(data);
                setError("");
            }
        })
        .catch((err) => {
            console.error("Gagal mengambil transaksi:", err);

            if (!ignore) {
                setError(
                    err.response?.data?.message ||
                        "Gagal mengambil data transaksi."
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

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0);

    const formatPaymentStatus = (status) => {
        const statuses = {
            pending: {
                label: "Belum Dibayar",
                style: "bg-yellow-100 text-yellow-700",
            },
            awaiting_verification: {
                label: "Menunggu Verifikasi",
                style: "bg-blue-100 text-blue-700",
            },
            paid: {
                label: "Lunas",
                style: "bg-green-100 text-green-700",
            },
            rejected: {
                label: "Ditolak",
                style: "bg-red-100 text-red-700",
            },
        };

        return statuses[status] || {
            label: status || "-",
            style: "bg-gray-100 text-gray-700",
        };
    };

    const filteredTransactions = transactions.filter((transaction) => {
        const keyword = search.toLowerCase();

        return (
            transaction.order_number?.toLowerCase().includes(keyword) ||
            transaction.user?.name?.toLowerCase().includes(keyword) ||
            transaction.book?.title?.toLowerCase().includes(keyword)
        );
    });

    const handlePaymentUpdate = async (transaction, newStatus) => {
    const message =
        newStatus === "paid"
            ? transaction.payment_method === "cod"
                ? "Apakah kamu sudah menerima pembayaran COD dari Customer?"
                : "Apakah pembayaran QRIS sudah diperiksa dan benar-benar diterima?"
            : "Apakah kamu yakin ingin menolak konfirmasi pembayaran ini?";

        if (!window.confirm(message)) return;

        try {
            setUpdatingId(transaction.id);

            await updatePaymentStatus(transaction.id, newStatus);

            alert(
                newStatus === "paid"
                    ? "Pembayaran berhasil diperbarui menjadi LUNAS."
                    : "Konfirmasi pembayaran berhasil ditolak."
            );

            setSelectedTransaction(null);
            await fetchTransactions();
        } catch (err) {
            console.error("Gagal memperbarui pembayaran:", err);

            alert(
                err.response?.data?.message ||
                    "Gagal memperbarui status pembayaran."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const getPaymentActions = (transaction) => {
        if (
            transaction.payment_method === "qris" &&
            transaction.payment_status === "awaiting_verification"
        ) {
            return (
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        disabled={updatingId === transaction.id}
                        onClick={() =>
                            handlePaymentUpdate(transaction, "paid")
                        }
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        Setujui
                    </button>

                    <button
                        type="button"
                        disabled={updatingId === transaction.id}
                        onClick={() =>
                            handlePaymentUpdate(transaction, "rejected")
                        }
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        Tolak
                    </button>
                </div>
            );
        }

        if (
            transaction.payment_method === "cod" &&
            transaction.payment_status === "pending"
        ) {
            return (
                <button
                    type="button"
                    disabled={updatingId === transaction.id}
                    onClick={() =>
                        handlePaymentUpdate(transaction, "paid")
                    }
                    className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                    Tandai Lunas
                </button>
            );
        }

        if (transaction.payment_status === "paid") {
            return (
                <span className="text-xs font-semibold text-green-600">
                    Sudah Lunas
                </span>
            );
        }

        if (transaction.payment_status === "rejected") {
            return (
                <span className="text-xs text-red-600">
                    Menunggu konfirmasi ulang Customer
                </span>
            );
        }

        return (
            <span className="text-xs text-gray-400">
                Belum ada konfirmasi
            </span>
        );
    };

    return (
        <section className="bg-gray-50 p-3 dark:bg-gray-900 sm:p-5">
            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                {/* Header */}
                <div className="p-4">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Transactions
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Daftar transaksi dan verifikasi pembayaran buku.
                    </p>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nomor pesanan, customer, atau judul buku..."
                        
className="mt-4 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"

                    />
                </div>

                {/* Loading, Error, dan Tabel */}
                {loading ? (
                    <div className="p-6 text-center">
                        Memuat data transaksi...
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-red-600">
                        {error}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-4 py-3">Order Number</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Book</th>
                                    <th className="px-4 py-3">Quantity</th>
                                    <th className="px-4 py-3">Total Amount</th>
                                    <th className="px-4 py-3">Metode</th>
                                    <th className="px-4 py-3">Pembayaran</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction) => {
                                        const payment = formatPaymentStatus(
                                            transaction.payment_status
                                        );

                                        return (
                                            <tr
                                                key={transaction.id}
                                                className="border-b dark:border-gray-700"
                                            >
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                    {transaction.order_number}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {transaction.user?.name || "-"}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {transaction.book?.title || "-"}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {transaction.quantity}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {formatCurrency(
                                                        transaction.total_amount
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 font-medium uppercase">
                                                    {transaction.payment_method || "-"}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${payment.style}`}
                                                    >
                                                        {payment.label}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedTransaction(
                                                                transaction
                                                            )
                                                        }
                                                        className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                                                    >
                                                        Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-4 py-6 text-center"
                                        >
                                            {search
                                                ? "Transaksi tidak ditemukan."
                                                : "Belum ada transaksi."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal Detail Transaksi */}
                {selectedTransaction && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                        <div className="my-auto w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Detail Transaksi
                                </h2>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedTransaction(null)
                                    }
                                    className="text-2xl text-gray-500 hover:text-gray-800"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-gray-500">
                                        Nomor Pesanan
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {selectedTransaction.order_number}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Customer</p>
                                    <p className="font-semibold text-gray-900">
                                        {selectedTransaction.user?.name || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Buku</p>
                                    <p className="font-semibold text-gray-900">
                                        {selectedTransaction.book?.title || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">
                                        Jumlah Pembelian
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {selectedTransaction.quantity}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">
                                        Total Pembayaran
                                    </p>
                                    <p className="font-bold text-indigo-700">
                                        {formatCurrency(
                                            selectedTransaction.total_amount
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">
                                        Metode Pembayaran
                                    </p>
                                    <p className="font-semibold uppercase text-gray-900">
                                        {selectedTransaction.payment_method || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">
                                        Status Pembayaran
                                    </p>
                                    <span
                                        className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                            formatPaymentStatus(
                                                selectedTransaction.payment_status
                                            ).style
                                        }`}
                                    >
                                        {
                                            formatPaymentStatus(
                                                selectedTransaction.payment_status
                                            ).label
                                        }
                                    </span>
                                </div>

                                <div>
                                    <p className="text-gray-500">
                                        Status Pesanan
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {selectedTransaction.order_status || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">
                                        Tanggal Transaksi
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {selectedTransaction.created_at
                                            ? new Date(
                                                  selectedTransaction.created_at
                                              ).toLocaleString("id-ID")
                                            : "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                {getPaymentActions(selectedTransaction)}
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedTransaction(null)
                                }
                                className="mt-4 w-full rounded-lg bg-gray-200 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-300"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}

                {/* Total Transaksi */}
                <div className="p-4 text-sm text-gray-500">
                    Total transaksi: {transactions.length}
                </div>
            </div>
        </section>
    );
}
