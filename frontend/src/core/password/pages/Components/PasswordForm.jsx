import { usePasswordBarra } from '@/core/password/hooks/usePasswordBarra';
import { passwordSchema } from '@/shared/schemas/usuario.schema.js';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@/shared/app-bridge';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import PasswordBarra from './PasswordBarra';
import PasswordReglas from './PasswordReglas';

export default function PasswordForm({ token, onSuccess }) {
    const { register, handleSubmit, watch } = useForm({
        resolver: zodResolver(passwordSchema),
    });

    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const { progreso, reglas } = usePasswordBarra(password, confirmPassword);

    const handlePasswordSubmit = async (data) => {
        const id = toast.loading('Enviando código...');
        try {
            await router.post(
                `/api/v1/auth/cambiar-password/${token}`,
                {
                    password: data.password,
                    password_confirmation: data.confirmPassword,
                },
                {
                    onSuccess: () => {
                        toast.success('Código enviado a tu correo', { id });
                        onSuccess(data);
                    },
                },
            );
        } catch (error) {
            toast.error('Ocurrió un error inesperado', { id });
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
