import { clearAuthSession, logoutApi } from '@/core/auth/services/auth.service';

export default function useLogout() {
    const logout = async () => {
        try {
            await logoutApi();
        } catch (err) {
            console.error('Logout error:', err);
            clearAuthSession();
        } finally {
            window.location.assign('/login');
        }
    };

    return logout;
}
