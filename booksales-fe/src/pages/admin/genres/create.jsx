import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createGenre } from "../../../_services/genres";

export default function GenreCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await createGenre(formData);

            alert("Genre berhasil ditambahkan!");
            navigate("/admin/genres");
        } catch (error) {
            console.log(error);

            const responseData = error.response?.data;

            if (responseData?.message && typeof responseData.message === "object") {
                const messages = Object.values(responseData.message).flat();
                setError(messages.join(", "));
            } else {
                setError(
                    responseData?.message || "Gagal menambahkan genre."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Add New Genre
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                    Enter the genre information below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Genre Name
                        </label>

                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter genre name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter genre description"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Genre"}
                        </button>

                        <Link
                            to="/admin/genres"
                            className="text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            Cancel
                        </Link>
                    </div>

                </form>
            </div>
        </section>
    );
}
