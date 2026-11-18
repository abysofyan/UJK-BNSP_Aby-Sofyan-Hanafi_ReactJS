import { Link } from "react-router-dom";

export default function FAQ() {
    const questions = [
        {
            category: "Akun",
            items: [
                {
                    question: "Apakah harus memiliki akun untuk membeli buku?",
                    answer:
                        "Ya. Kamu harus login menggunakan akun TemuBuku sebelum melakukan pembelian buku.",
                },
                {
                    question: "Bagaimana jika belum memiliki akun?",
                    answer:
                        "Kamu bisa membuat akun melalui menu Register yang tersedia di halaman TemuBuku.",
                },
                {
                    question: "Bagaimana cara masuk ke akun TemuBuku?",
                    answer:
                        "Klik menu Login, kemudian masukkan email dan password yang sudah kamu daftarkan.",
                },
            ],
        },
        {
            category: "Pembelian Buku",
            items: [
                {
                    question: "Bagaimana cara membeli buku?",
                    answer:
                        "Pilih buku di halaman Katalog Buku, tentukan jumlah pembelian, kemudian klik Beli Sekarang.",
                },
                {
                    question: "Apakah jumlah pembelian dibatasi oleh stok?",
                    answer:
                        "Ya. Jumlah buku yang dibeli tidak boleh melebihi stok yang tersedia.",
                },
                {
                    question: "Bagaimana jika buku yang saya inginkan habis?",
                    answer:
                        "Buku yang stoknya habis belum dapat dibeli. Silakan cek kembali ketika stok sudah tersedia.",
                },
            ],
        },
        {
            category: "Transaksi",
            items: [
                {
                    question: "Bagaimana mengetahui transaksi berhasil?",
                    answer:
                        "Setelah pembelian berhasil, sistem akan menampilkan pemberitahuan dan nomor pesanan.",
                },
                {
                    question: "Di mana saya bisa melihat riwayat pembelian?",
                    answer:
                        "Buka menu Riwayat Transaksi untuk melihat daftar pembelian yang sudah kamu lakukan.",
                },
                {
                    question: "Apakah saya bisa melihat nomor pesanan?",
                    answer:
                        "Ya. Nomor pesanan ditampilkan setelah transaksi berhasil dan dapat dilihat kembali melalui detail riwayat transaksi jika tersedia.",
                },
            ],
        },
    ];

    return (
        <main className="min-h-screen bg-[#F8F4EF] text-[#351E10]">

            {/* Hero */}
            <section className="bg-[#351E10] px-6 py-16 text-center text-white md:py-20">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D6B99B]">
                    Pusat Informasi TemuBuku
                </p>

                <h1 className="text-3xl font-bold md:text-5xl">
                    Frequently Asked Questions
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#E8DCCF] md:text-base">
                    Temukan jawaban dari berbagai pertanyaan seputar akun,
                    pembelian buku, dan transaksi di TemuBuku.
                </p>
            </section>

            {/* FAQ Content */}
            <section className="mx-auto max-w-4xl px-6 py-16">
                {questions.map((group) => (
                    <div key={group.category} className="mb-12">
                        <h2 className="mb-6 text-xl font-bold md:text-2xl">
                            {group.category}
                        </h2>

                        <div className="space-y-4">
                            {group.items.map((item, index) => (
                                <details
                                    key={index}
                                    className="group rounded-xl border border-[#E8DCCF] bg-white p-5 shadow-sm"
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                                        <span>{item.question}</span>

                                        <span className="text-xl text-[#A16D43] transition group-open:rotate-45">
                                            +
                                        </span>
                                    </summary>

                                    <p className="mt-4 border-t border-[#E8DCCF] pt-4 text-sm leading-relaxed text-[#806D5D]">
                                        {item.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* Contact */}
            <section className="bg-[#EADCCB] px-6 py-14 text-center">
                <h2 className="text-2xl font-bold">
                    Masih Ada Pertanyaan?
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#806D5D]">
                    Jika belum menemukan jawaban yang kamu cari,
                    silakan hubungi TemuBuku melalui WhatsApp.
                </p>

                <a
                    href="https://wa.me/6281223456789?text=Halo%20TemuBuku%2C%20saya%20ingin%20bertanya."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block rounded-lg bg-[#351E10] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#54331F]"
                >
                    Hubungi Kami
                </a>
            </section>

            {/* Back to Home */}
            <div className="py-8 text-center">
                <Link
                    to="/"
                    className="text-sm font-semibold text-[#79563A] hover:underline"
                >
                    ← Kembali ke Home
                </Link>
            </div>

        </main>
    );
}
