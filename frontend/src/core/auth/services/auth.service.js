import { apiClient, getApiData } from '@/shared/lib/api-client';

const STORAGE_KEYS = {
    user: 'user',
    sidebar: 'sidebar',
    permisos: 'permisos',
};

export async function loginApi(payload) {
    const response = await apiClient.post('/auth/login', payload);
    const data = getApiData(response) || {};
    persistAuthSession(data);
    return data;
}

export async function meApi() {
    const response = await apiClient.get('/auth/me');
    const data = getApiData(response) || {};
    persistAuthContext(data);
    return data;
}

export async function logoutApi() {
    await apiClient.post('/auth/logout');
    clearAuthSession();
}

export function persistAuthSession(data) {
    persistAuthContext(data);
}

export function persistAuthContext(data) {
    if (data?.user) {
        window.localStorage.setItem(
            STORAGE_KEYS.user,
            JSON.stringify(data.user),
        );
    }
    if (Array.isArray(data?.sidebar)) {
        window.localStorage.setItem(
            STORAGE_KEYS.sidebar,
            JSON.stringify(data.sidebar),
        );
    }
    if (data?.permisos && typeof data.permisos === 'object') {
        window.localStorage.setItem(
            STORAGE_KEYS.permisos,
            JSON.stringify(data.permisos),
        );
    }
}

export function clearAuthSession() {
    Object.values(STORAGE_KEYS).forEach((key) => {
        window.localStorage.removeItem(key);
        window.sessionStorage.removeItem(key);
    });
}

export function getStoredPermisos() {
    const raw = window.localStorage.getItem(STORAGE_KEYS.permisos) || window.sessionStorage.getItem(STORAGE_KEYS.permisos);
    if (!raw) return {};
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}
