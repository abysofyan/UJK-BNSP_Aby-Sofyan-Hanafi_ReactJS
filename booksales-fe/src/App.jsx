import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/public";
import PublicLayout from "./layouts/public";
import Books from "./pages/public/books";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import AdminLayout from "./layouts/admin";
import Dashboard from "./pages/admin";
import AdminBooks from "./pages/admin/books";
import BookCreate from "./pages/admin/books/create";
import AdminGenres from "./pages/admin/genres";
import GenreCreate from "./pages/admin/genres/create";
import AdminAuthors from "./pages/admin/authors";
import AuthorCreate from "./pages/admin/authors/create";
import GenreEdit from "./pages/admin/genres/edit";
import AuthorEdit from "./pages/admin/authors/edit";
import BookEdit from "./pages/admin/books/edit";
import AdminTransactions from "./pages/admin/transactions";
import MyTransactions from "./pages/public/transactions";
import Layanan from "./pages/public/layanan";
import Blog from "./pages/public/blog";
import CaraPemesanan from "./pages/public/cara-pemesanan";
import FAQ from "./pages/public/faq";
import Users from "./pages/admin/users";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route element={<PublicLayout />}>
                        <Route index element={<Home />} />
                        <Route path="books" element={<Books />} />
                        <Route path="transactions" element={<MyTransactions />} />
                        <Route path="layanan" element={<Layanan />} />
                        <Route path="blog" element={<Blog />} />
                        <Route path="cara-pemesanan" element={<CaraPemesanan />} />
                        <Route path="faq" element={<FAQ />} />
                    </Route>

                    {/* Auth */}
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />

                    {/* Admin */}
                    <Route path="admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />

                        <Route path="books">
                            <Route index element={<AdminBooks />} />
                            <Route path="create" element={<BookCreate />} />
                            <Route path="edit/:id" element={<BookEdit />} />
                        </Route>

                        <Route path="genres">
                            <Route index element={<AdminGenres />} />
                            <Route path="create" element={<GenreCreate />} />
                            <Route path="edit/:id" element={<GenreEdit />} />
                        </Route>

                        <Route path="authors">
                            <Route index element={<AdminAuthors />} />
                            <Route path="create" element={<AuthorCreate />} />
                            <Route path="edit/:id" element={<AuthorEdit />} />
                        </Route>

                        <Route path="users" element={<Users />} />
                        {/* Transaction */}
                        <Route
                            path="transactions"
                            element={<AdminTransactions />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
