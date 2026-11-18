import API from "../_api";

export const getTransactions = async () => {
    const response = await API.get("/transactions");
    return response.data.data ?? [];
};

export const deleteTransaction = async (id) => {
    const response = await API.delete(`/transactions/${id}`);
    return response.data;
};

export const createTransaction = async (
    book_id,
    quantity,
    payment_method
) => {
    const response = await API.post("/transactions", {
        book_id,
        quantity,
        payment_method,
    });

    return response.data;
};

export const getMyTransactions = async () => {
    const response = await API.get("/my-transactions");
    return response.data.data ?? [];
};


export const confirmPayment = async (id) => {
    const response = await API.post(
        `/transactions/${id}/confirm-payment`
    );

    return response.data;
};

export const updatePaymentStatus = async (id, payment_status) => {
    const response = await API.patch(
        `/transactions/${id}/payment-status`,
        { payment_status }
    );

    return response.data;
};
