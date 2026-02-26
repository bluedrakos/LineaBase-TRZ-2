import { FloatingLabelInput } from '@/Components/FloatingLabelInput';
import SvgMitra from '@/Components/General/SvgMitra';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Label } from '@/Components/ui/label';
import { cn } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { AlertOctagon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { usePage } from "@inertiajs/react";


export function LoginForm() {

    const { nombreSistema, descripcionSistema } = usePage().props;
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            usuario: '',
            contrasena: '',
            remember: false,
        },
    });

    const [error, setErrorMsg] = useState('');

    const onSubmit = (data) => {
        setErrorMsg('');

        router.post('/login', data, {
            onError: (errors) => {
                if (errors.usuario) {
                    setError('usuario', {
                        type: 'manual',
                        message: errors.usuario,
                    });
                    setErrorMsg(errors.usuario);
                }
                if (errors.contrasena) {
                    setError('contrasena', {
                        type: 'manual',
                        message: errors.contrasena,
                    });
                }
                if (errors.error) {
                    setErrorMsg(errors.error);
                }
            },
        });
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-6">
            <div className="flex w-full max-w-md flex-col items-center space-y-6">
                {/* Logo */}
                <SvgMitra
                    className="h-auto w-40"
                    lightColor="rgb(0,64,100)"
                    darkColor="#ffffff"
                />

                {/* Título */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-[#0e4c75] dark:text-white">
                        {nombreSistema}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {descripcionSistema}
                    </p>
                </div>

                {/* Error global */}
                {error && (
                    <Alert
                        variant="destructive"
                        className="flex w-full items-start gap-4 rounded-md border border-red-500 bg-red-100 px-4 py-3 text-sm text-red-800 dark:border-red-500 dark:bg-red-900/80 dark:text-red-200"
                    >
                        <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-300" />
                        <div>
                            <AlertTitle className="text-base font-semibold">
                                Error al iniciar sesión
                            </AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {/* Formulario */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full space-y-4"
                >
                    <Controller
                        name="usuario"
                        control={control}
                        rules={{ required: 'El usuario es requerido' }}
                        render={({ field }) => (
                            <FloatingLabelInput
                                id="usuario"
                                label="Usuario"
                                type="text"
                                {...field}
                            />
                        )}
                    />

                    <Controller
                        name="contrasena"
                        control={control}
                        rules={{ required: 'La contraseña es requerida' }}
                        render={({ field }) => (
                            <FloatingLabelInput
                                id="contrasena"
                                label="Contraseña"
                                type="password"
                                {...field}
                            />
                        )}
                    />
                    {errors.contrasena && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.contrasena.message}
                        </p>
                    )}

                    <Controller
                        name="remember"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="recuerdame"
                                        name="recuerdame"
                                        checked={field.value}
                                        onCheckedChange={(checked) =>
                                            field.onChange(!!checked)
                                        }
                                        className="data-[state=checked]:bg-[rgb(0,64,100)] dark:data-[state=checked]:bg-white"
                                    />
                                    <Label
                                        htmlFor="recuerdame"
                                        className="text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        Recuérdame
                                    </Label>
                                </div>
                                <Link
                                    href={route('email.forgot.password')}
                                    className="text-xs text-gray-600 dark:text-gray-400"
                                >
                                    Olvidé mi contraseña
                                </Link>
                            </div>
                        )}
                    />

                    <Button
                        type="submit"
                        className={cn(
                            'w-full font-semibold transition-colors',
                            'bg-[rgb(0,64,100)] text-white hover:bg-[rgb(0,85,150)]',
                            'dark:bg-white dark:text-[rgb(0,64,100)] dark:hover:bg-gray-200',
                            'disabled:opacity-50',
                        )}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
                    </Button>
                </form>

                {/* Footer */}
                <div className="pt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                    Copyright © 2024 Especialistas.
                </div>
            </div>
        </div>
    );
}
