import api from "./api";

export const productService ={
    getProducts: (params ={}) => api.get('/products', {params}),
    getProduct: (id) => api.get(`/products/${id}`),
    createProduct: (productData) => {
        const fromData = new FormData();
        Object.keys(productData).forEach(key => {
            if (key === 'images' && productData[key]) {
                productData[key].forEach(image => fromData.append('images', image))
            } else {
                fromData.append(key, productData[key]);
            }
        });
    },
    updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
    deleteProduct: (id) => api.delete(`/products/${id}`),
};