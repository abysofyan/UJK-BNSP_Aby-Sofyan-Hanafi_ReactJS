import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-[#F5F0E8]">
            <div className="mx-auto max-w-screen-xl px-6 py-16 md:py-24 lg:px-8">

                <div className="grid items-center gap-12 lg:grid-cols-2">

                    {/* Bagian Teks */}
                    <div className="text-center lg:text-left">

                        <span className="inline-block rounded-full bg-[#E9DFD1] px-4 py-2 text-sm font-semibold text-[#795B43]">
                            Selamat Datang di TemuBuku
                        </span>

                        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-[#392D24] sm:text-5xl lg:text-6xl">
                            Temukan Cerita,
                            <span className="block text-[#A16D43]">
                                Temukan Dunia Baru.
                            </span>
                        </h1>

                        <p className="mt-6 text-base leading-relaxed text-[#746557] md:text-lg">
                            TemuBuku hadir untuk menemani perjalanan membaca
                            kamu. Temukan berbagai pilihan buku menarik, mulai
                            dari novel, pendidikan, hingga pengembangan diri.
                            Pilih buku favoritmu dan nikmati pengalaman
                            belanja buku yang mudah dan menyenangkan.
                        </p>

                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">

                            <Link
                                to="/books"
                                className="rounded-lg bg-[#79563A] px-7 py-3.5 text-center font-semibold text-white shadow-md transition hover:bg-[#60432E]"
                            >
                                Jelajahi Buku
                            </Link>

                            <a
                                href="#tentang-booksales"
                                className="rounded-lg border border-[#79563A] px-7 py-3.5 text-center font-semibold text-[#79563A] transition hover:bg-[#E9DFD1]"
                            >
                                Tentang TemuBuku
                            </a>

                        </div>

                        <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-[#746557] lg:justify-start">
                            <div>
                                <p className="font-bold text-[#392D24]">
                                    Banyak Pilihan
                                </p>
                                <p>Koleksi berbagai genre</p>
                            </div>

                            <div>
                                <p className="font-bold text-[#392D24]">
                                    Mudah Dicari
                                </p>
                                <p>Temukan buku favorit</p>
                            </div>

                            <div>
                                <p className="font-bold text-[#392D24]">
                                    Praktis
                                </p>
                                <p>Belanja secara online</p>
                            </div>
                        </div>
                    </div>

                    {/* Bagian Ilustrasi */}
                    <div className="relative mx-auto w-full max-w-lg">

                        <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-[#DCC8AE] opacity-70 blur-2xl"></div>

                        <div className="relative rounded-3xl bg-[#E8D9C6] p-6 shadow-xl md:p-10">

                            <div className="rounded-2xl bg-[#F9F6F0] p-6 md:p-8">

                                <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-[#A16D43]">
                                    Your Reading Journey
                                </p>

                                <div className="my-8 flex items-end justify-center gap-3">

                                    <div className="h-44 w-24 -rotate-6 rounded-md bg-[#7B4937] p-3 shadow-lg">
                                        <div className="flex h-full flex-col justify-between border border-white/30 p-2 text-center text-white">
                                            <span className="text-xs tracking-widest">
                                                BOOK
                                            </span>
                                            <span className="text-sm font-bold">
                                                THE ART OF READING
                                            </span>
                                            <span className="text-[9px]">
                                                TemuBuku
                                            </span>
                                        </div>
                                    </div>

                                    <div className="z-10 h-52 w-28 rounded-md bg-[#C18B55] p-3 shadow-xl">
                                        <div className="flex h-full flex-col justify-between border border-white/40 p-2 text-center text-white">
                                            <span className="text-xs tracking-widest">
                                                DISCOVER
                                            </span>
                                            <span className="text-lg font-bold">
                                                A WORLD OF STORIES
                                            </span>
                                            <span className="text-[9px]">
                                                TemuBuku
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-40 w-24 rotate-6 rounded-md bg-[#53665B] p-3 shadow-lg">
                                        <div className="flex h-full flex-col justify-between border border-white/30 p-2 text-center text-white">
                                            <span className="text-xs tracking-widest">
                                                READ
                                            </span>
                                            <span className="text-sm font-bold">
                                                GROW EVERY DAY
                                            </span>
                                            <span className="text-[9px]">
                                                TemuBuku
                                            </span>
                                        </div>
                                    </div>

                                </div>

                                <p className="text-center text-sm italic text-[#795B43]">
                                    "One book can change your world."
                                </p>

                            </div>

                            <div className="absolute -bottom-5 -right-4 rounded-xl bg-white px-5 py-3 shadow-lg">
                                <p className="text-sm font-bold text-[#392D24]">
                                    Happy Reading!
                                </p>
                                <p className="text-xs text-[#746557]">
                                    Start your next chapter
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
