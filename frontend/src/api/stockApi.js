import api from "./axios";


export const stockIn = async (productId, quantity) => {

    const response = await api.post(
        `/stock/${productId}/in`,
        null,
        {
            params: {
                quantity: quantity
            }
        }
    );

    return response.data;
};


export const stockOut = async (productId, quantity) => {

    const response = await api.post(
        `/stock/${productId}/out`,
        null,
        {
            params: {
                quantity: quantity
            }
        }
    );

    return response.data;
};