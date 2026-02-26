import { ModeToggle } from '@/Components/mode-toggle';
import { LoginForm } from '@/Pages/Auth/components/login-form';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';

export default function Login() {
    // Buscamos los mensajes del helper with() del backend por inertia
    const { props } = usePage();
    useEffect(() => {
        if (props.flash?.success) {
            toast.success(props.flash.success);
        }
        if (props.flash?.error) {
            toast.error(props.flash.error);
        }
    }, [props.flash]);
    return (
        <>
            <Head title="Login" />
            <div className="flex h-screen w-full items-center justify-center bg-white text-gray-900 dark:bg-slate-900 dark:text-gray-100">
                <div className="w-full max-w-sm px-6">
                    <LoginForm />
                </div>
                <div className="fixed right-4 bottom-4 z-50">
                    <ModeToggle />
                </div>
            </div>
            <Toaster richColors position="top-right" />
        </>
    );
}
