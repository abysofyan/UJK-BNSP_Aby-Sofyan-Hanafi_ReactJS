import { Link } from "react-router-dom";

export default function Blog() {
    const articles = [
        {
            category: "Tips Membaca",
            title: "5 Cara Membangun Kebiasaan Membaca Setiap Hari",
            description:
                "Mulai kebiasaan membaca dengan langkah sederhana agar membaca menjadi bagian dari aktivitas sehari-hari.",
            date: "16 November 2026",
            number: "01",
            readTime: "5 menit membaca",
        },
        {
            category: "Rekomendasi Buku",
            title: "Buku yang Cocok untuk Menambah Wawasan",
            description:
                "Temukan inspirasi bacaan yang dapat membantu memperluas pengetahuan dan sudut pandang.",
            date: "16 November 2026",
            number: "02",
            readTime: "4 menit membaca",
        },
        {
            category: "Dunia Literasi",
            title: "Mengapa Membaca Buku Itu Penting?",
            description:
                "Mengenal manfaat membaca untuk meningkatkan pengetahuan, kreativitas, dan kemampuan berpikir.",
            date: "16 November 2026",
            number: "03",
            readTime: "6 menit membaca",
        },
    ];

    return (
        <main className="min-h-screen bg-[#F8F4EF] text-[#351E10]">

            {/* Hero Blog */}
            <section className="bg-[#351E10] px-6 py-16 text-center text-white md:py-20">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D6B99B]">
                    TemuBuku Journal
                </p>

                <h1 className="text-3xl font-bold md:text-5xl">
                    Cerita dan Inspirasi Membaca
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#E8DCCF] md:text-base">
                    Temukan artikel menarik, tips membaca, rekomendasi buku,
                    dan berbagai informasi seputar dunia literasi bersama TemuBuku.
                </p>
            </section>

            {/* Artikel */}
            <section className="mx-auto max-w-screen-xl px-6 py-16">
                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-wider text-[#A16D43]">
                        Jelajahi Artikel
                    </p>

                    <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                        Artikel Terbaru
                    </h2>

                    <p className="mt-3 text-sm text-[#806D5D]">
                        Bacaan pilihan untuk menemani perjalanan literasimu.
                    </p>
                </div>

                <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                        <article
                            key={article.number}
                            className="overflow-hidden rounded-2xl border border-[#E8DCCF] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            {/* Ilustrasi artikel */}
                            <div className="flex h-48 items-center justify-center bg-[#EADCCB]">
                                <span className="text-7xl">📚</span>
                            </div>

                            <div className="p-6">
                                <span className="rounded-full bg-[#F3E8DC] px-3 py-1 text-xs font-semibold text-[#79563A]">
                                    {article.category}
                                </span>

                                <h3 className="mt-5 min-h-16 text-xl font-bold leading-snug">
                                    {article.title}
                                </h3>

                                <p className="mt-3 min-h-20 text-sm leading-relaxed text-[#806D5D]">
                                    {article.description}
                                </p>

                                <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-[#E8DCCF] pt-4 text-xs text-[#927F6E]">
                                    <span>{article.date}</span>
                                    <span>{article.readTime}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Ajakan */}
            <section className="bg-[#EADCCB] px-6 py-14 text-center">
                <h2 className="text-2xl font-bold">
                    Sudah Menemukan Buku Favoritmu?
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#806D5D]">
                    Jelajahi koleksi buku TemuBuku dan temukan bacaan
                    yang sesuai dengan minatmu.
                </p>

                <Link
                    to="/books"
                    className="mt-6 inline-block rounded-lg bg-[#351E10] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#54331F]"
                >
                    Lihat Katalog Buku
                </Link>
            </section>

        </main>
    );
}