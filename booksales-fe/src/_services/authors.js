
import API from "../_api";

// READ
export const getAuthors = async () => {
    const { data } = await API.get("/authors");
    return data.data;
};

// CREATE
export const createAuthor = async (author) => {
    const { data } = await API.post("/authors", author);
    return data;
};

// UPDATE
export const updateAuthor = async (id, author) => {
    const { data } = await API.post(`/authors/${id}`, author);
    return data;
};

// DELETE
export const deleteAuthor = async (id) => {
    const { data } = await API.delete(`/authors/${id}`);
    return data;
};
