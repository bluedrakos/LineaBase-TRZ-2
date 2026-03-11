import { handleApiError } from './ApiError';

export const apiClient = axios.create({
    baseURL: '/api/v1',
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    // Las peticiones utilizan Cookies HttpOnly, configurado globalmente en bootstrap.js.
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(handleApiError(error))
);

export function getApiData(response) {
    return response?.data?.data ?? null;
}
