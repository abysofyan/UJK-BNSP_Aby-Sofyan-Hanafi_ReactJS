import { Link } from "react-router-dom";

export default function Layanan() {
    const services = [
        {
            number: "01",
            title: "Cara Pemesanan",
            description:
                "Pilih buku yang kamu inginkan, tentukan jumlah pembelian, lalu klik tombol Beli Sekarang.",
        },
        {
            number: "02",
            title: "Pembelian Buku",
            description:
                "Pastikan kamu sudah login sebelum melakukan pembelian. Stok buku akan diperbarui setelah transaksi berhasil.",
        },
        {
            number: "03",
            title: "Riwayat Transaksi",
            description:
                "Kamu dapat melihat daftar pembelian dan nomor pesanan melalui menu Riwayat Transaksi.",
        },
    ];

    const faqs = [
        {
            question: "Apakah harus login untuk membeli buku?",
            answer:
                "Ya. Customer harus login terlebih dahulu sebelum melakukan pembelian buku.",
        },
        {
            question: "Bagaimana cara melihat pesanan saya?",
            answer:
                "Buka menu Riwayat Transaksi untuk melihat daftar pembelian yang pernah dilakukan.",
        },
        {
            question: "Bagaimana jika stok buku habis?",
            answer:
                "Buku yang stoknya habis tidak dapat dibeli sampai stok tersedia kembali.",
        },
    ];

    return (
        <main className="min-h-screen bg-[#F8F4EF] text-[#351E10]">
            {/* Header */}
            <section className="bg-[#351E10] px-6 py-16 text-center text-white">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D6B99B]">
                    Pusat Bantuan TemuBuku
                </p>

                <h1 className="text-3xl font-bold md:text-4xl">
                    Layanan Customer
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#E8DCCF] md:text-base">
                    Kami menyediakan informasi untuk membantu kamu
                    berbelanja buku dengan lebih mudah dan nyaman.
                </p>
            </section>

            {/* Cara Pemesanan */}
            <section className="mx-auto max-w-screen-xl px-6 py-16">
                <div className="mb-10 text-center">
                    <h2 className="text-2xl font-bold md:text-3xl">
                        Cara Berbelanja di TemuBuku
                    </h2>

                    <p className="mt-3 text-sm text-[#806D5D]">
                        Ikuti langkah sederhana berikut untuk membeli buku.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {services.map((service) => (
                        <div
                            key={service.number}
                            className="rounded-2xl border border-[#E8DCCF] bg-white p-7 shadow-sm"
                        >
                            <span className="text-3xl font-extrabold text-[#B58A65]">
                                {service.number}
                            </span>

                            <h3 className="mt-5 text-lg font-bold">
                                {service.title}
                            </h3>

                            <p className="mt-3 text-sm leading-relaxed text-[#806D5D]">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        to="/books"
                        className="inline-block rounded-lg bg-[#351E10] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#54331F]"
                    >
                        Jelajahi Katalog Buku
                    </Link>
                </div>
            </section>

            {/* FAQ */}
            <section className="bg-white px-6 py-16">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold md:text-3xl">
                            Pertanyaan yang Sering Diajukan
                        </h2>

                        <p className="mt-3 text-sm text-[#806D5D]">
                            Beberapa informasi yang mungkin kamu butuhkan.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <details
                                key={index}
                                className="group rounded-xl border border-[#E8DCCF] bg-[#F8F4EF] p-5"
                            >
                                <summary className="cursor-pointer font-semibold">
                                    {faq.question}
                                </summary>

                                <p className="mt-3 text-sm leading-relaxed text-[#806D5D]">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Kontak */}
            <section className="px-6 py-16 text-center">
                <h2 className="text-2xl font-bold">
                    Butuh Bantuan Lebih Lanjut?
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#806D5D]">
                    Jika kamu mengalami kendala saat menggunakan TemuBuku,
                    silakan hubungi pengelola toko melalui informasi kontak
                    resmi yang nantinya akan dicantumkan di sini.
                </p>
            </section>
        </main>
    );
}
