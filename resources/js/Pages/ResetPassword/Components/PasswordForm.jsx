import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { usePasswordBarra } from '@/Pages/ResetPassword/hooks/usePasswordBarra';
import { passwordSchema } from '@/Schemas/usuario.schema.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import PasswordBarra from './PasswordBarra';
import PasswordReglas from './PasswordReglas';

export default function PasswordForm({ token, onSuccess }) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ resolver: zodResolver(passwordSchema) });

    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const { progreso, reglas } = usePasswordBarra(password, confirmPassword);

    const handlePasswordSubmit = async (data) => {
        try {
            await router.post(
                route('enviar.resetPassword', { token }),
                {
                    password: data.password,
                    password_confirmation: data.confirmPassword,
                },
                { onSuccess: () => onSuccess(data) },
            );
        } catch (error) {
            toast.error('Ocurrió un error inesperado');
        }
    };

    return (
        <form onSubmit={handleSubmit(handlePasswordSubmit)}>
            <Label htmlFor="password" className="text-lg">
                Contraseña
            </Label>
            <Input id="password" type="password" {...register('password')} />

            <PasswordBarra progreso={progreso} coincide={reglas.coincide} />

            <Label htmlFor="confirmPassword" className="mt-4 text-lg">
                Confirmar Contraseña
            </Label>
            <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
            />

            <PasswordReglas reglas={reglas} />

            <Button type="submit" className="mt-4 w-full p-6 text-lg">
                Enviar código de confirmación al correo
            </Button>
        </form>
    );
}
