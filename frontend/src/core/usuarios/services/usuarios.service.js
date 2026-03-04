import { apiClient, getApiData } from '@/shared/lib/api-client';

export async function fetchUsuarios(params = {}) {
    const response = await apiClient.get('/usuarios', { params });
    return {
        items: getApiData(response) ?? [],
        meta: response?.data?.meta ?? {},
    };
}

export async function fetchUsuariosMeta() {
    const response = await apiClient.get('/usuarios/meta');
    return getApiData(response) ?? {};
}

export async function fetchUsuarioById(id) {
    const response = await apiClient.get(`/usuarios/${id}`);
    return getApiData(response);
}

export async function createUsuario(payload) {
    const response = await apiClient.post('/usuarios', payload);
    return getApiData(response);
}

export async function updateUsuario(id, payload) {
    const response = await apiClient.put(`/usuarios/${id}`, payload);
    return getApiData(response);
}

export async function toggleUsuarioActivo(id) {
    const response = await apiClient.patch(`/usuarios/${id}/activo`);
    return getApiData(response);
}

export async function toggleUsuarioEstado(id) {
    const response = await apiClient.patch(`/usuarios/${id}/estado`);
    return getApiData(response);
}
