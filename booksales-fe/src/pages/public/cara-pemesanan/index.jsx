import { Link } from "react-router-dom";

export default function CaraPemesanan() {
    const steps = [
        {
            number: "01",
            icon: "📚",
            title: "Pilih Buku",
            description:
                "Buka halaman Katalog Buku, lalu cari dan pilih buku yang ingin kamu beli.",
        },
        {
            number: "02",
            icon: "🔢",
            title: "Tentukan Jumlah",
            description:
                "Masukkan jumlah buku yang ingin dibeli. Pastikan jumlahnya tidak melebihi stok tersedia.",
        },
        {
            number: "03",
            icon: "🔐",
            title: "Login ke Akun",
            description:
                "Pastikan kamu sudah login ke akun TemuBuku sebelum melanjutkan pembelian.",
        },
        {
            number: "04",
            icon: "🛒",
            title: "Klik Beli Sekarang",
            description:
                "Klik tombol Beli Sekarang dan periksa konfirmasi jumlah serta total harga pembelian.",
        },
        {
            number: "05",
            icon: "✅",
            title: "Transaksi Berhasil",
            description:
                "Setelah transaksi berhasil, kamu akan mendapatkan nomor pesanan.",
        },
        {
            number: "06",
            icon: "📋",
            title: "Cek Riwayat Transaksi",
            description:
                "Buka menu Riwayat Transaksi untuk melihat daftar pembelian yang sudah dilakukan.",
        },
    ];

    return (
        <main className="min-h-screen bg-[#F8F4EF] text-[#351E10]">

            {/* Hero */}
            <section className="bg-[#351E10] px-6 py-16 text-center text-white md:py-20">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D6B99B]">
                    Panduan Customer
                </p>

                <h1 className="text-3xl font-bold md:text-5xl">
                    Cara Pemesanan Buku
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#E8DCCF] md:text-base">
                    Belanja buku di TemuBuku sangat mudah.
                    Ikuti beberapa langkah berikut untuk mulai
                    menemukan dan membeli buku favoritmu.
                </p>
            </section>

            {/* Steps */}
            <section className="mx-auto max-w-screen-xl px-6 py-16">
                <div className="mb-12 text-center">
                    <h2 className="text-2xl font-bold md:text-3xl">
                        Langkah Pembelian
                    </h2>

                    <p className="mt-3 text-sm text-[#806D5D]">
                        Ikuti panduan pembelian buku dari awal hingga selesai.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="rounded-2xl border border-[#E8DCCF] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-4xl">
                                    {step.icon}
                                </span>

                                <span className="text-3xl font-extrabold text-[#D6B99B]">
                                    {step.number}
                                </span>
                            </div>

                            <h3 className="mt-6 text-lg font-bold">
                                {step.title}
                            </h3>

                            <p className="mt-3 text-sm leading-relaxed text-[#806D5D]">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-[#EADCCB] px-6 py-14 text-center">
                <h2 className="text-2xl font-bold">
                    Siap Menemukan Buku Favoritmu?
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#806D5D]">
                    Yuk, jelajahi berbagai pilihan buku yang tersedia
                    di katalog TemuBuku.
                </p>

                <Link
                    to="/books"
                    className="mt-6 inline-block rounded-lg bg-[#351E10] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#54331F]"
                >
                    Mulai Belanja
                </Link>
            </section>

        </main>
    );
}
