import { router } from '@/shared/app-bridge';
import { toast } from '@/shared/lib/toast';
import { Button } from '@/shared/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/shared/ui/input-otp';
import { useState } from 'react';

export default function PasswordOTPForm({
    token,
    password,
    confirmPassword,
    onSubmit,
    onResend,
    submitLabel = 'Confirmar y guardar contraseña',
    resendLabel = 'Reenviar codigo',
    otpError,
    disabled = false,
}) {
    const [otp, setOtp] = useState('');

    const handleOtpSubmit = async () => {
        const payload = {
            password,
            password_confirmation: confirmPassword,
            otp,
        };

        try {
            if (onSubmit) {
                await onSubmit(payload, { otp });
                return;
            }

            await router.post(`/api/v1/auth/cambiar-password/${token}/reset`, payload, {
                onSuccess: () => {
                    toast.success('Contraseña cambiada con éxito');
                    router.visit('/login');
                },
            });
        } catch {
            if (!onSubmit) {
                toast.error('Ocurrio un error inesperado');
            }
        }
    };

    const handleResendOtp = async () => {
        try {
            if (onResend) {
                await onResend();
                return;
            }

            await router.post(`/api/v1/auth/cambiar-password/${token}/reenviar`, {}, {
                onSuccess: () => toast.success('Nuevo codigo enviado a tu correo'),
                onError: () => toast.error('Error al reenviar el codigo'),
            });
        } catch {
            if (!onResend) {
                toast.error('Error inesperado');
            }
        }
    };

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                handleOtpSubmit();
            }}
        >
            <div className="flex justify-center">
                <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    className="gap-3"
                    disabled={disabled}
                >
                    <InputOTPGroup className="gap-3">
                        {[0, 1, 2].map((index) => (
                            <InputOTPSlot
                                key={index}
                                index={index}
                                className="h-14 w-10 text-2xl"
                            />
                        ))}
                        <InputOTPSeparator />
                        {[3, 4, 5].map((index) => (
                            <InputOTPSlot
                                key={index}
                                index={index}
                                className="h-14 w-10 text-2xl"
                            />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
            </div>

            {otpError ? (
                <p className="text-destructive mt-3 text-center text-sm">
                    {otpError}
                </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3">
                <Button type="submit" className="w-full p-6 text-lg" disabled={disabled}>
                    {submitLabel}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOtp}
                    className="p-6 text-lg"
                    disabled={disabled}
                >
                    {resendLabel}
                </Button>
            </div>
        </form>
    );
}
