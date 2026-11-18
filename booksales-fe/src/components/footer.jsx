import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="border-t border-[#6B5142] bg-[#351E10]">
            <div className="mx-auto max-w-screen-xl px-6 py-12 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-3xl">📚</span>
                            <span className="text-2xl font-extrabold text-white">
                                TemuBuku.
                            </span>
                        </Link>

                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#D6C5B5]">
                            Temukan buku favoritmu, perluas wawasan, dan mulai
                            perjalanan membaca yang menyenangkan bersama
                            TemuBuku.
                        </p>
                    </div>

                    {/* Tentang */}
                    <div>
                        <h2 className="mb-4 text-base font-bold text-white">
                            Tentang Kami
                        </h2>

                        <ul className="space-y-3 text-sm text-[#E8DCCF]">
                            <li>
                                <Link
                                    to="/"
                                    className="transition hover:text-white"
                                >
                                    Tentang TemuBuku
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className="transition hover:text-white"
                                >
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Bantuan */}
                    <div>
                        <h2 className="mb-4 text-base font-bold text-white">
                            Bantuan
                        </h2>

                        <ul className="space-y-3 text-sm text-[#E8DCCF]">
                            <li>
                                <Link
                                    to="/cara-pemesanan"
                                    className="transition hover:text-white"
                                >
                                    Cara Pemesanan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/faq"
                                    className="transition hover:text-white"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://wa.me/6281223482524?text=Halo%20TemuBuku%2C%20saya%20ingin%20bertanya%20mengenai%20produk%20dan%20layanan%20TemuBuku."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition hover:text-white"
                                >
                                    Kontak (WhatsApp)
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Jelajahi */}
                    <div>
                        <h2 className="mb-4 text-base font-bold text-white">
                            Jelajahi
                        </h2>

                        <ul className="space-y-3 text-sm text-[#E8DCCF]">
                            <li>
                                <Link
                                    to="/"
                                    className="transition hover:text-white"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/books"
                                    className="transition hover:text-white"
                                >
                                    Katalog Buku
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className="transition hover:text-white"
                                >
                                    Artikel dan Tips Membaca
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="mt-10 border-t border-[#6B5142] pt-6">
                    <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row">
                        <p className="text-sm text-[#D6C5B5]">
                            © 2026 TemuBuku. All Rights Reserved.
                        </p>

                        <div className="flex flex-wrap justify-center gap-5 text-sm text-[#D6C5B5]">
                            <Link
                                to="/layanan"
                                className="transition hover:text-white"
                            >
                                Kebijakan Privasi
                            </Link>

                            <Link
                                to="/layanan"
                                className="transition hover:text-white"
                            >
                                Syarat dan Ketentuan
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
