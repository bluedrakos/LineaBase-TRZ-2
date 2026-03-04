import { apiClient, getApiData } from '@/shared/lib/api-client';

export async function createTipoModulo(payload) {
    const response = await apiClient.post('/tipo-modulo', payload);
    return getApiData(response);
}

export async function updateTipoModulo(id, payload) {
    const response = await apiClient.put(`/tipo-modulo/${id}`, payload);
    return getApiData(response);
}
