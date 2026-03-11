import { ModeToggle } from '@/Components/mode-toggle';
import { LoginForm } from './components/login-form';
import { Head } from '@/shared/app-bridge';

export default function Login() {
    return (
        <>
            <Head title="Iniciar Sesión" />
            <div className="flex h-screen w-full items-center justify-center bg-white text-gray-900 dark:bg-slate-900 dark:text-gray-100">
                <div className="w-full max-w-sm px-6">
                    <LoginForm />
                </div>
                <div className="fixed right-4 bottom-4 z-50">
                    <ModeToggle />
                </div>
            </div>
        </>
    );
}
