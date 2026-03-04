import { apiClient, getApiData } from '@/shared/lib/api-client';

export async function fetchDashboardResumen() {
    const response = await apiClient.get('/dashboard/resumen');
    return getApiData(response) ?? {};
}
