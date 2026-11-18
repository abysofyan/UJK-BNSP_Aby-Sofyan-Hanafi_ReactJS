import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../../../_api";
import { updateAuthor } from "../../../_services/authors";

export default function AuthorEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        photo: null,
        bio: "",
    });

    const [oldPhoto, setOldPhoto] = useState("");
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const { data } = await API.get(`/authors/${id}`);
                const author = data.data;

                setFormData({
                    name: author.name || "",
                    photo: null,
                    bio: author.bio || "",
                });

                setOldPhoto(author.photo || "");
            } catch (error) {
                console.log(error);
                setError("Gagal mengambil data author.");
            } finally {
                setLoading(false);
            }
        };

        fetchAuthor();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "photo") {
            const file = files[0];

            if (file) {
                setFormData((prev) => ({
                    ...prev,
                    photo: file,
                }));

                setPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {
            const payload = new FormData();

            payload.append("_method", "PUT");
            payload.append("name", formData.name);
            payload.append("bio", formData.bio);

            if (formData.photo) {
                payload.append("photo", formData.photo);
            }

            await updateAuthor(id, payload);

            alert("Author berhasil diperbarui!");
            navigate("/admin/authors");
        } catch (error) {
            console.log(error);

            const responseData = error.response?.data;

            if (responseData?.message && typeof responseData.message === "object") {
                setError(Object.values(responseData.message).flat().join(", "));
            } else if (responseData?.errors) {
                setError(Object.values(responseData.errors).flat().join(", "));
            } else {
                setError(responseData?.message || "Gagal memperbarui author.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-5">Loading data author...</div>;
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Edit Author
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                    Update author information below.
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
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

                        {oldPhoto && !preview && (
                            <div className="mb-3">
                                <p className="text-sm text-gray-500 mb-2">
                                    Current Photo:
                                </p>

                                <img
                                    src={`http://127.0.0.1:8000/storage/authors/${oldPhoto}`}
                                    alt="Current author"
                                    className="w-28 h-28 rounded-lg object-cover"
                                />
                            </div>
                        )}

                        {preview && (
                            <div className="mb-3">
                                <p className="text-sm text-gray-500 mb-2">
                                    New Photo Preview:
                                </p>

                                <img
                                    src={preview}
                                    alt="New author preview"
                                    className="w-28 h-28 rounded-lg object-cover"
                                />
                            </div>
                        )}

                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 dark:text-white"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            JPG, JPEG, or PNG. Maximum size 2 MB.
                            Leave empty to keep the current photo.
                        </p>
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
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            disabled={saving}
                            className="text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50"
                        >
                            {saving ? "Updating..." : "Update Author"}
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
