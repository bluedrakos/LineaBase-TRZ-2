import { apiClient, getApiData } from '@/shared/lib/api-client';

export async function fetchModulos(params = {}) {
    const response = await apiClient.get('/modulos', { params });
    return {
        items: getApiData(response) ?? [],
        meta: response?.data?.meta ?? {},
    };
}

export async function fetchModulosMeta() {
    const response = await apiClient.get('/modulos/meta');
    return getApiData(response) ?? {};
}

export async function createModulo(payload) {
    const response = await apiClient.post('/modulos', payload);
    return getApiData(response);
}

export async function updateModulo(id, payload) {
    const response = await apiClient.put(`/modulos/${id}`, payload);
    return getApiData(response);
}

export async function deleteModulo(id) {
    const response = await apiClient.delete(`/modulos/${id}`);
    return getApiData(response);
}

export async function toggleModuloActivo(id) {
    const response = await apiClient.patch(`/modulos/${id}/activo`);
    return getApiData(response);
}
