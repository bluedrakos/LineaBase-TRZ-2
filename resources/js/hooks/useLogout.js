// src/hooks/useLogout.js
import { useForm } from '@inertiajs/react';

export default function useLogout() {
    const { post } = useForm();

    const logout = () => post(route('logout'));

    return logout;
}
