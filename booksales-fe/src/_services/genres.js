import API from "../_api";

// READ
export const getGenres = async () => {
    const { data } = await API.get("/genres");
    return data.data;
};

// CREATE
export const createGenre = async (genre) => {
    const { data } = await API.post("/genres", genre);
    return data;
};

// UPDATE
export const updateGenre = async (id, genre) => {
    const { data } = await API.put(`/genres/${id}`, genre);
    return data;
};

// DELETE
export const deleteGenre = async (id) => {
    const { data } = await API.delete(`/genres/${id}`);
    return data;
};
