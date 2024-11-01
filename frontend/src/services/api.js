import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const getUserById = (id) => api.get(`/api/users/${id}`);
export default api;
