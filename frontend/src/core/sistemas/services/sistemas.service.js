export async function getSistemas() {
    const response = await window.axios.get('/api/v1/sistemas');
    return response.data.data.sistemas;
}

export async function createSistema(data) {
    const response = await window.axios.post('/api/v1/sistemas', data);
    return response.data.data.sistema;
}

export async function updateSistema(id, data) {
    const response = await window.axios.put(`/api/v1/sistemas/${id}`, data);
    return response.data.data.sistema;
}

export async function deleteSistema(id) {
    await window.axios.delete(`/api/v1/sistemas/${id}`);
}
