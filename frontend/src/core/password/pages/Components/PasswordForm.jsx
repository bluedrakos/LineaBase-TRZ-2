import { usePasswordBarra } from '@/core/password/hooks/usePasswordBarra';
import { router } from '@/shared/app-bridge';
import { toast } from '@/shared/lib/toast';
import { cn } from '@/shared/lib/utils';
import { passwordSchema } from '@/shared/schemas/usuario.schema.js';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import PasswordBarra from './PasswordBarra';
import PasswordReglas from './PasswordReglas';

export default function PasswordForm({
    token,
    onSuccess,
    onSubmit,
    submitLabel = 'Enviar codigo de confirmacion al correo',
    serverErrors = {},
    disabled = false,
    className = '',
}) {
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
        const payload = {
            password: data.password,
            password_confirmation: data.confirmPassword,
        };

        try {
            if (onSubmit) {
                await onSubmit(payload, data);
                onSuccess?.(data);
                return;
            }

            const id = toast.loading('Enviando codigo...');
            await router.post(`/api/v1/auth/cambiar-password/${token}`, payload, {
                onSuccess: () => {
                    toast.success('Codigo enviado a tu correo', { id });
                    onSuccess?.(data);
                },
            });
        } catch {
            if (!onSubmit) {
                toast.error('Ocurrio un error inesperado');
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handlePasswordSubmit)}
            className={cn('space-y-5', className)}
        >
            <div className="space-y-2">
                <Label htmlFor="password" className="text-lg">
                    Contraseña
                </Label>
                <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    disabled={disabled}
                />
            </div>

            <div className="space-y-2">
                <PasswordBarra progreso={progreso} coincide={reglas.coincide} />
                {errors.password?.message ? (
                    <p className="text-destructive text-sm">
                        {errors.password.message}
                    </p>
                ) : null}
                {!errors.password?.message && serverErrors.password?.[0] ? (
                    <p className="text-destructive text-sm">
                        {serverErrors.password[0]}
                    </p>
                ) : null}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-lg">
                    Confirmar contraseña
                </Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    disabled={disabled}
                />
            </div>

            <div className="space-y-2">
                <PasswordReglas reglas={reglas} />
                {errors.confirmPassword?.message ? (
                    <p className="text-destructive text-sm">
                        {errors.confirmPassword.message}
                    </p>
                ) : null}
                {!errors.confirmPassword?.message &&
                serverErrors.password_confirmation?.[0] ? (
                    <p className="text-destructive text-sm">
                        {serverErrors.password_confirmation[0]}
                    </p>
                ) : null}
            </div>

            <Button type="submit" className="mt-6 w-full p-6 text-lg" disabled={disabled}>
                {submitLabel}
            </Button>
        </form>
    );
}
