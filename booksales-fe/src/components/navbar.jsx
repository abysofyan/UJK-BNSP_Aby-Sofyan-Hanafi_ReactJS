import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");

        if (!token) return null;

        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setMenuOpen(false);
        navigate("/", { replace: true });
    };

    const closeMenu = () => setMenuOpen(false);

    const navLinkClass = ({ isActive }) =>
        `block rounded-lg px-3 py-2 text-sm font-medium transition ${
            isActive
                ? "text-[#A16D43] bg-[#F5F0E8]"
                : "text-gray-700 hover:bg-[#F5F0E8] hover:text-[#A16D43]"
        }`;

    return (
        <header className="sticky top-0 z-50 border-b border-[#E9DFD1] bg-white shadow-sm">
            <nav className="mx-auto max-w-screen-xl px-5 py-4 lg:px-8">

                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="flex items-center gap-2"
                    >
                        <span className="text-3xl">📚</span>

                        <span className="text-2xl font-extrabold tracking-tight text-[#79563A]">
                            TemuBuku<span className="text-[#C18B55]">.</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-2 lg:flex">

                        <Link to="/" className={navLinkClass}>
                            Home
                        </Link>

                        <Link to="/books" className={navLinkClass}>
                            Katalog Buku
                        </Link>

                        <Link to="/blog" className={navLinkClass}>
                            Blog
                        </Link>

                        <Link to="/layanan" className={navLinkClass}>
                            Layanan
                        </Link>

                        {user && (
                            <Link
                                to="/transactions"
                                className={navLinkClass}
                            >
                                Riwayat Transaksi
                            </Link>
                        )}

                    </div>

                    {/* User Authentication */}
                    <div className="hidden items-center gap-3 lg:flex">

                        {user ? (
                            <>
                                <span className="text-sm font-semibold text-[#79563A]">
                                    Halo, {user.name || "Customer"}
                                </span>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#79563A] transition hover:bg-[#F5F0E8]"
                                >
                                    Masuk
                                </Link>

                                <Link
                                    to="/register"
                                    className="rounded-lg bg-[#79563A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#60432E]"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}

                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="rounded-lg p-2 text-[#79563A] hover:bg-[#F5F0E8] lg:hidden"
                        aria-label="Toggle navigation menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>

                </div>

                {/* Mobile Navigation */}
                {menuOpen && (
                    <div className="mt-4 border-t border-[#E9DFD1] pt-4 lg:hidden">

                        <div className="flex flex-col gap-2">

                            <Link
                                to="/"
                                className={navLinkClass}
                                onClick={closeMenu}
                            >
                                Home
                            </Link>

                            <Link
                                to="/books"
                                className={navLinkClass}
                                onClick={closeMenu}
                            >
                                Katalog Buku
                            </Link>

                            <Link
                                to="/blog"
                                className={navLinkClass}
                                onClick={closeMenu}
                            >
                                Blog
                            </Link>

                            <Link
                                to="/layanan"
                                className={navLinkClass}
                                onClick={closeMenu}
                            >
                                Layanan
                            </Link>

                            {user && (
                                <Link
                                    to="/transactions"
                                    className={navLinkClass}
                                    onClick={closeMenu}
                                >
                                    Riwayat Transaksi
                                </Link>
                            )}

                        </div>

                        <div className="mt-4 border-t border-[#E9DFD1] pt-4">

                            {user ? (
                                <div className="flex flex-col gap-3">
                                    <p className="text-sm font-semibold text-[#79563A]">
                                        Halo, {user.name || "Customer"}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <Link
                                        to="/login"
                                        onClick={closeMenu}
                                        className="flex-1 rounded-lg border border-[#79563A] px-4 py-2.5 text-center text-sm font-semibold text-[#79563A]"
                                    >
                                        Masuk
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={closeMenu}
                                        className="flex-1 rounded-lg bg-[#79563A] px-4 py-2.5 text-center text-sm font-semibold text-white"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}

                        </div>

                    </div>
                )}

            </nav>
        </header>
    );
}
