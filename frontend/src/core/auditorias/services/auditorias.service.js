import { apiClient, getApiData } from '@/shared/lib/api-client';

export async function fetchAuditorias(params = {}) {
    const response = await apiClient.get('/auditorias', { params });
    return {
        items: getApiData(response) ?? [],
        meta: response?.data?.meta ?? {},
    };
}
