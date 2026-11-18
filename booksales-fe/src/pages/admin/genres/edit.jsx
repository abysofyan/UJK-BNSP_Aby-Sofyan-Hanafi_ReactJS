import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../../../_api";
import { updateGenre } from "../../../_services/genres";

export default function GenreEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGenre = async () => {
            try {
                const { data } = await API.get(`/genres/${id}`);

                setFormData({
                    name: data.data.name || "",
                    description: data.data.description || "",
                });
            } catch (error) {
                console.log(error);
                setError("Gagal mengambil data genre.");
            } finally {
                setLoading(false);
            }
        };

        fetchGenre();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {
            await updateGenre(id, formData);

            alert("Genre berhasil diperbarui!");
            navigate("/admin/genres");
        } catch (error) {
            console.log(error);

            const responseData = error.response?.data;

            if (responseData?.message && typeof responseData.message === "object") {
                setError(Object.values(responseData.message).flat().join(", "));
            } else {
                setError(responseData?.message || "Gagal memperbarui genre.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-5">Loading data genre...</div>;
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Edit Genre
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                    Update genre information below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Genre Name
                        </label>

                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50"
                        >
                            {saving ? "Updating..." : "Update Genre"}
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
