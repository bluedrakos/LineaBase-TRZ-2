import { Button } from '@/shared/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/shared/ui/input-otp';
import { router } from '@/shared/app-bridge';
import { useState } from 'react';
import { toast } from '@/shared/lib/toast';

export default function PasswordOTPForm({ token, password, confirmPassword }) {
    const [otp, setOtp] = useState('');

    const handleOtpSubmit = async () => {
        try {
            await router.post(`/api/v1/auth/cambiar-password/${token}/reset`, {
                password: password,
                password_confirmation: confirmPassword,
                otp,
            }, {
                onSuccess: () => {
                    toast.success('Contraseña cambiada con éxito');
                    router.visit('/login');
                }
            });
        } catch {
            toast.error('Ocurrió un error inesperado');
        }
    };

    const handleResendOtp = async () => {
        try {
            await router.post(
                `/api/v1/auth/cambiar-password/${token}/reenviar`,
                {},
                {
                    onSuccess: () =>
                        toast.success('Nuevo código enviado a tu correo'),
                    onError: () => toast.error('Error al reenviar el código'),
                },
            );
        } catch {
            toast.error('Error inesperado');
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleOtpSubmit();
            }}
        >
            <div className="flex justify-center">
                <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    className="gap-3"
                >
                    <InputOTPGroup className="gap-3">
                        {[0, 1, 2].map((i) => (
                            <InputOTPSlot
                                key={i}
                                index={i}
                                className="h-14 w-10 text-2xl"
                            />
                        ))}
                        <InputOTPSeparator />
                        {[3, 4, 5].map((i) => (
                            <InputOTPSlot
                                key={i}
                                index={i}
                                className="h-14 w-10 text-2xl"
                            />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <Button type="submit" className="w-full p-6 text-lg">
                    Confirmar y guardar contraseña
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOtp}
                    className="p-6 text-lg"
                >
                    Reenviar código
                </Button>
            </div>
        </form>
    );
}
