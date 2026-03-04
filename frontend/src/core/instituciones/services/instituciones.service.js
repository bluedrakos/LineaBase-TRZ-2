import { apiClient, getApiData } from '@/shared/lib/api-client';

export async function fetchInstituciones(params = {}) {
    const response = await apiClient.get('/instituciones', { params });
    return {
        items: getApiData(response) ?? [],
        meta: response?.data?.meta ?? {},
    };
}

export async function createInstitucion(payload) {
    const response = await apiClient.post('/instituciones', payload);
    return getApiData(response);
}

export async function updateInstitucion(id, payload) {
    const response = await apiClient.put(`/instituciones/${id}`, payload);
    return getApiData(response);
}
