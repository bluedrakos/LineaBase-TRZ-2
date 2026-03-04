import axios from 'axios';

export const apiClient = axios.create({
    baseURL: '/api/v1',
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('token') || window.sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const payload = error?.response?.data;
        const normalized = {
            status: error?.response?.status ?? 500,
            message: payload?.message ?? error.message ?? 'Error de red',
            errors: payload?.errors ?? {},
        };
        return Promise.reject(normalized);
    },
);

export function getApiData(response) {
    return response?.data?.data ?? null;
}
