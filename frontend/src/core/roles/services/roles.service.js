import { apiClient, getApiData } from '@/shared/lib/api-client';

export async function fetchRoles(params = {}) {
    const response = await apiClient.get('/roles', { params });
    return {
        items: getApiData(response) ?? [],
        meta: response?.data?.meta ?? {},
    };
}

export async function fetchRolesMeta() {
    const response = await apiClient.get('/roles/meta');
    return getApiData(response) ?? {};
}

export async function createRol(payload) {
    const response = await apiClient.post('/roles', payload);
    return getApiData(response);
}

export async function updateRol(id, payload) {
    const response = await apiClient.put(`/roles/${id}`, payload);
    return getApiData(response);
}

export async function toggleRolActivo(id) {
    const response = await apiClient.patch(`/roles/${id}/activo`);
    return getApiData(response);
}
