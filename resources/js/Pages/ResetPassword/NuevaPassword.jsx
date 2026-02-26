import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { passwordSchema } from '@/Schemas/usuario.schema.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
import zxcvbn from 'zxcvbn';

export default function NuevaPassword({ token }) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors: formErrors },
    } = useForm({
        resolver: zodResolver(passwordSchema),
    });

    const [passwordStrength, setPasswordStrength] = useState(null);
    const onSubmit = async (data) => {
        const formData = {
            password: data.password,
            password_confirmation: data.confirmPassword,
        };

        const promise = new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    await router.post(
                        route('password.update', { token }),
                        formData,
                    );

                    resolve();
                } catch (error) {
                    reject();
                }
            }, 2000);
        });

        toast.promise(promise, {
            error: 'Ocurrió un error al cambiar la contraseña, inténtalo nuevamente',
            success: 'Contraseña cambiada con éxito',
            loading: 'Cargando...',
        });
    };

    const passwordValue = watch('password');
    const confirmPasswordValue = watch('confirmPassword');

    useEffect(() => {
        if (passwordValue) {
            const result = zxcvbn(passwordValue);
            setPasswordStrength(result);
        } else {
            setPasswordStrength(null);
        }
    }, [passwordValue]);

    const reglas = {
        largo: passwordValue?.length >= 8,
        mayusculas: /[A-Z]/.test(passwordValue || ''),
        numero: /[0-9]/.test(passwordValue || ''),
        caracter: /[^A-Za-z0-9]/.test(passwordValue || ''),
        coincide: passwordValue && passwordValue === confirmPasswordValue,
    };

    const reglasCumplidas = [
        reglas.largo,
        reglas.mayusculas,
        reglas.numero,
        reglas.caracter,
    ].filter(Boolean).length;

    const progreso = (reglasCumplidas / 4) * 100;
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>Reestablecer Contraseña</CardTitle>
                        <CardDescription>
                            ¡Bienvenido! Para poder acceder a los servicios de
                            TrackIoT, es necesario que configures una nueva
                            contraseña.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...register('password')}
                                    />
                                    <div className="mt-2">
                                        <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
                                            <div
                                                className="h-2 rounded transition-all"
                                                style={{
                                                    width: `${progreso}%`,
                                                    backgroundColor:
                                                        progreso < 50
                                                            ? 'red'
                                                            : progreso < 75
                                                              ? 'orange'
                                                              : 'green',
                                                }}
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {progreso === 100 && reglas.coincide
                                                ? 'Contraseña exitosa'
                                                : progreso === 100
                                                  ? 'Ahora confirma tu contraseña'
                                                  : 'Sigue completando los requisitos'}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="confirmPassword">
                                            Confirmar Contraseña
                                        </Label>
                                    </div>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        {...register('confirmPassword')}
                                    />
                                    <ul className="mt-2 space-y-1 text-sm">
                                        <li
                                            className={`flex items-center gap-2 pl-1 font-medium ${
                                                reglas.largo
                                                    ? 'text-green-600'
                                                    : 'text-red-500'
                                            }`}
                                        >
                                            {reglas.largo ? (
                                                <Check
                                                    size={18}
                                                    strokeWidth={3}
                                                    color="#007a2b"
                                                />
                                            ) : (
                                                <X
                                                    size={18}
                                                    strokeWidth={3}
                                                    color="#7a0000"
                                                />
                                            )}
                                            Al menos 8 caracteres
                                        </li>
                                        <li
                                            className={`flex items-center gap-2 pl-1 font-medium ${
                                                reglas.mayusculas
                                                    ? 'text-green-600'
                                                    : 'text-red-500'
                                            }`}
                                        >
                                            {reglas.mayusculas ? (
                                                <Check
                                                    size={18}
                                                    strokeWidth={3}
                                                    color="#007a2b"
                                                />
                                            ) : (
                                                <X
                                                    size={18}
                                                    strokeWidth={3}
                                                    color="#7a0000"
                                                />
                                            )}
                                            Al menos 1 mayúscula
                                        </li>
                                        <li
                                            className={`flex items-center gap-2 pl-1 font-medium ${
                                                reglas.numero
                                                    ? 'text-green-600'
                                                    : 'text-red-500'
                                            }`}
                                        >
                                            {reglas.numero ? (
                                                <Check
                                                    size={18}
                                                    strokeWidth={3}
                                                    color="#007a2b"
                                                />
                                            ) : (
                                                <X
                                                    size={18}
                                                    strokeWidth={3}
                                                    color="#7a0000"
                                                />
                                            )}
                                            Al menos 1 número
                                        </li>
                                        <li
                                            className={`flex items-center gap-2 pl-1 font-medium ${
                                                reglas.caracter
                                                    ? 'text-green-600'
                                                    : 'text-red-500'
                                            }`}
                                        >
                                            {reglas.caracter ? (
                                                <Check
                                                    size={18}
                                                    strokeWidth={3}
                                                    color="#007a2b"
                                                />
                                            ) : (
                                                <X
                                                    size={18}
                                                    strokeWidth={3}
                                                    color="#7a0000"
                                                />
                                            )}
                                            Al menos 1 carácter especial
                                        </li>
                                        <li
                                            className={`flex items-center gap-2 pl-1 font-medium ${
                                                reglas.coincide
                                                    ? 'text-green-600'
                                                    : 'text-red-500'
                                            }`}
                                        >
                                            {reglas.coincide ? (
                                                <Check
                                                    size={18}
                                                    strokeWidth={3}
                                                    color="#007a2b"
                                                />
                                            ) : (
                                                <X
                                                    size={18}
                                                    strokeWidth={3}
                                                    color="#7a0000"
                                                />
                                            )}
                                            Las contraseñas deben coincidir
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button type="submit" className="w-full">
                                        Crear nueva contraseña
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <Toaster richColors position="top-right" />
        </div>
    );
}
