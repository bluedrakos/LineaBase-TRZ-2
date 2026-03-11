import { Button } from '@/shared/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { router, usePage } from '@/shared/app-bridge';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';

export default function OlvidePassword() {
    const { props } = usePage();

    useEffect(() => {
        if (props.flash?.success) {
            toast.success(props.flash.success);
        }

        if (props.flash?.error) {
            toast.error(props.flash.error);
        }
    }, [props.flash]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const id = toast.loading('Enviando enlace...');
        try {
            await router.post('/api/v1/auth/olvide-password', {
                email: data.email,
            });
            toast.success('Enlace de recuperación enviado. Revisa tu correo.', { id });
        } catch (error) {
            toast.error('No pudimos enviar el enlace. Verifica tu correo.', { id });
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="h-auto w-[600px]">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Indicanos tu correo electronico
                        </CardTitle>
                        <CardDescription className="text-lg">
                            Te enviaremos un link a tu correo electronico para
                            reestablecer la contraseña
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-3">
                                    <Label className="text-lg" htmlFor="email">
                                        Correo electronico
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register('email', { required: 'El correo electrónico es requerido' })}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        className="w-full p-6 text-lg"
                                    >
                                        Enviar enlace de reestablecer contaseña
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
