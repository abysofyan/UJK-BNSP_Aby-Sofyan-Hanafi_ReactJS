import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../_api";

export default function AuthorCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        photo: null,
        bio: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState("");

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "photo") {
            const file = files[0];

            if (file) {
                setFormData({
                    ...formData,
                    photo: file,
                });

                setPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const payload = new FormData();

            payload.append("name", formData.name);
            payload.append("photo", formData.photo);
            payload.append("bio", formData.bio);

            await API.post("/authors", payload);

            alert("Author berhasil ditambahkan!");
            navigate("/admin/authors");
        } catch (error) {
            console.log(error);

            const responseData = error.response?.data;

            if (responseData?.message && typeof responseData.message === "object") {
                const messages = Object.values(responseData.message).flat();
                setError(messages.join(", "));
            } else if (responseData?.errors) {
                const messages = Object.values(responseData.errors).flat();
                setError(messages.join(", "));
            } else {
                setError(
                    responseData?.message || "Gagal menambahkan author."
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
                    Add New Author
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                    Enter the author information below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Author Name
                        </label>

                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter author name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="photo"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Author Photo
                        </label>

                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 dark:text-white"
                            required
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            JPG, JPEG, or PNG. Maximum size 2 MB.
                        </p>

                        {preview && (
                            <div className="mt-3">
                                <img
                                    src={preview}
                                    alt="Author preview"
                                    className="w-28 h-28 rounded-lg object-cover"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="bio"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Biography
                        </label>

                        <textarea
                            id="bio"
                            name="bio"
                            rows="4"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Enter author biography"
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
                            disabled={loading || !formData.photo}
                            className="text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Author"}
                        </button>

                        <Link
                            to="/admin/authors"
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
