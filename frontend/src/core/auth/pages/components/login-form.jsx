import { FloatingLabelInput } from '@/Components/FloatingLabelInput';
import SvgMitra from '@/shared/components/brand/SvgMitra';
import { cn } from '@/shared/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { Link, router, usePage } from '@/shared/app-bridge';
import { AlertOctagon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
    usuario: z.string().min(1, 'El usuario o correo es requerido'),
    contrasena: z.string().min(1, 'La contraseña es requerida'),
    remember: z.boolean().optional(),
});

export function LoginForm() {
    const navigate = useNavigate();
    const [branding, setBranding] = useState({
        nombreSistema: 'Cargando...',
        descripcionSistema: '...',
        versionSistema: '0.0.0',
    });
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            usuario: '',
            contrasena: '',
            remember: false,
        },
    });

    const [error, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchBranding = async () => {
            try {
                // Intentamos usar la URL base de axios o una relativa
                const response = await axios.get('/api/config/branding');
                if (response.data?.success) {
                    setBranding(response.data.data);
                } else {
                    throw new Error('API Error');
                }
            } catch (err) {
                console.error('Error fetching branding:', err);
                // Fallback a valores por defecto si falla la API
                setBranding({
                    nombreSistema: 'Línea Base TRZ',
                    descripcionSistema: 'Trazabilidad',
                    versionSistema: '1.0.0',
                });
            }
        };
        fetchBranding();
    }, []);

    const onSubmit = async (data) => {
        setErrorMsg('');

        try {
            const response = await axios.post('/api/v1/auth/login', data);
            
            // Si el backend lo devuelve en formato estandar { success: true, data: { token: ... } }
            // o si lo devuelve plano { token: ... }
            const payload = response.data.data || response.data;
            
                    if (payload && payload.token) {
                        const storage = data.remember ? localStorage : sessionStorage;
                        storage.setItem('token', payload.token);
                        storage.setItem('user', JSON.stringify(payload.user));
                        storage.setItem('sidebar', JSON.stringify(payload.sidebar));
                        storage.setItem('permisos', JSON.stringify(payload.permisos));
                        
                        const otherStorage = data.remember ? sessionStorage : localStorage;
                        otherStorage.removeItem('token');
                        otherStorage.removeItem('user');
                        otherStorage.removeItem('sidebar');
                        otherStorage.removeItem('permisos');
                        
                        // Set auth header globally immediately just in case
                        window.axios.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`;
                        navigate('/dashboard');
                    }
        } catch (err) {
            console.error('Login error:', err);
            
            if (err.response && err.response.data) {
                const apiErrors = err.response.data.errors || err.response.data;
                
                if (apiErrors.usuario) {
                    setError('usuario', { type: 'manual', message: apiErrors.usuario[0] || apiErrors.usuario });
                    // No seteamos el error global si ya hay detallado, o podemos poner un genérico
                }
                if (apiErrors.contrasena) {
                    setError('contrasena', { type: 'manual', message: apiErrors.contrasena[0] || apiErrors.contrasena });
                }
                // Si el backend devolvió un error directo (tipo json con 'message' o una cadena)
                if (typeof apiErrors === 'string') {
                    setErrorMsg(apiErrors);
                } else if (apiErrors.message) {
                    setErrorMsg(apiErrors.message);
                }
            } else {
                setErrorMsg('Error de conexión con el servidor.');
            }
        }
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
                        {branding.nombreSistema}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {branding.descripcionSistema}
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
                    <div className="space-y-1">
                        <Controller
                            name="usuario"
                            control={control}
                            render={({ field }) => (
                                <FloatingLabelInput
                                    id="usuario"
                                    label="Usuario"
                                    type="text"
                                    {...field}
                                />
                            )}
                        />
                        {errors.usuario && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.usuario.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Controller
                            name="contrasena"
                            control={control}
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
                    </div>

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
                                    href="/reset-password/olvide-password"
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
                    Copyright © 2024 Especialistas. v{branding.versionSistema}
                </div>
            </div>
        </div>
    );
}
