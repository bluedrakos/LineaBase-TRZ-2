import PasswordForm from '@/core/password/pages/Components/PasswordForm';
import PasswordOTPForm from '@/core/password/pages/Components/PasswordOTPForm';
import { router, usePage } from '@/shared/app-bridge';
import { toast } from '@/shared/lib/toast';
import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

function Stepper({ step }) {
    const steps = [1, 2, 3, 4];

    return (
        <div className="mb-2 flex items-center justify-center gap-2">
            {steps.map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                    <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                            step >= item
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                        }`}
                    >
                        {item}
                    </span>
                    {index < steps.length - 1 ? (
                        <span className="bg-border inline-block h-px w-7" />
                    ) : null}
                </div>
            ))}
        </div>
    );
}

export default function ForcePasswordChangeDialog() {
    const { props } = usePage();
    const user = props.auth?.user;
    const mustChangePassword = Boolean(
        user?.must_change_password ?? user?.usu_cambiar_password,
    );
    const passwordToken = user?.password_token ?? user?.usu_passwordToken ?? null;

    const [open, setOpen] = useState(mustChangePassword);
    const [step, setStep] = useState(1);
    const [stepDirection, setStepDirection] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [formValues, setFormValues] = useState({
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (mustChangePassword) {
            setOpen(true);
        }
    }, [mustChangePassword]);

    const otpError = useMemo(() => errors.otp?.[0] ?? null, [errors]);

    const stepVariants = {
        enter: (direction) => ({
            opacity: 0,
            x: direction > 0 ? 24 : -24,
            filter: 'blur(4px)',
        }),
        center: {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
        },
        exit: (direction) => ({
            opacity: 0,
            x: direction > 0 ? -24 : 24,
            filter: 'blur(4px)',
        }),
    };

    if (!mustChangePassword) {
        return null;
    }

    const clearErrors = () => setErrors({});
    const goToStep = (nextStep) => {
        setStepDirection(nextStep > step ? 1 : -1);
        setStep(nextStep);
    };

    const ensureTokenOrNotify = () => {
        if (passwordToken) return true;
        toast.error(
            'No se encontro token de cambio de contraseña. Solicita recuperacion por correo.',
        );
        return false;
    };

    const startOtpFlow = async (payload, data) => {
        if (!ensureTokenOrNotify()) return;

        clearErrors();
        setProcessing(true);

        try {
            await router.post(`/api/v1/auth/cambiar-password/${passwordToken}`, payload, {
                onError: (responseErrors) => setErrors(responseErrors || {}),
            });

            setFormValues({
                password: data?.password ?? payload.password,
                confirmPassword:
                    data?.confirmPassword ?? payload.password_confirmation,
            });

            goToStep(3);
            toast.success('Codigo enviado al correo.');
        } catch (error) {
            const responseErrors = error?.response?.data?.errors;
            if (responseErrors) {
                setErrors(responseErrors);
            }

            toast.error(
                error?.response?.data?.message ??
                    'No fue posible enviar el codigo de verificacion.',
            );
            throw error;
        } finally {
            setProcessing(false);
        }
    };

    const verifyAndSave = async (payload) => {
        if (!ensureTokenOrNotify()) return;

        clearErrors();
        setProcessing(true);

        try {
            await router.post(
                `/api/v1/auth/cambiar-password/${passwordToken}/reset`,
                payload,
                {
                    onError: (responseErrors) => setErrors(responseErrors || {}),
                },
            );

            toast.success('Contrasena actualizada correctamente.');
            goToStep(4);
        } catch (error) {
            const responseErrors = error?.response?.data?.errors;
            if (responseErrors) {
                setErrors(responseErrors);
            }

            toast.error(
                error?.response?.data?.message ??
                    'No fue posible validar el codigo OTP.',
            );
            throw error;
        } finally {
            setProcessing(false);
        }
    };

    const resendOtp = async () => {
        if (!ensureTokenOrNotify()) return;

        setProcessing(true);
        try {
            await router.post(`/api/v1/auth/cambiar-password/${passwordToken}/reenviar`, {});
            toast.success('Codigo reenviado.');
        } catch (error) {
            toast.error(
                error?.response?.data?.message ??
                    'No fue posible reenviar el codigo.',
            );
            throw error;
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                // Modal bloqueante: no se cierra manualmente.
            }}
        >
            <DialogContent
                className="sm:max-w-xl gap-2 p-4"
                showCloseButton={false}
                onEscapeKeyDown={(event) => event.preventDefault()}
                onPointerDownOutside={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Cambio obligatorio de contraseña</DialogTitle>
                    <DialogDescription>
                        Para continuar usando la plataforma, debes actualizar tu
                        contraseña.
                    </DialogDescription>
                </DialogHeader>

                <Stepper step={step} />

                <motion.div layout className="relative min-h-[270px] overflow-hidden">
                    <AnimatePresence mode="wait" custom={stepDirection}>
                        {step === 1 ? (
                            <motion.div
                                key="step-1"
                                custom={stepDirection}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="space-y-4"
                            >
                                <div className="bg-muted rounded-lg border p-4 text-sm">
                                    <p className="font-medium">
                                        Para poder usar los servicios de SICMO, es necesario
                                        cambiar la contraseña por temas de seguridad.
                                    </p>
                                    <p className="text-muted-foreground mt-2">
                                        En los siguientes pasos deberas definir una contraseña
                                        propia, validar el codigo OTP enviado a tu correo y
                                        confirmar el cambio para finalizar el proceso.
                                    </p>
                                </div>

                                {!passwordToken ? (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-sm">
                                        No se encontro el token para el cambio forzado. Puedes
                                        ir al flujo de recuperacion para generarlo nuevamente.
                                    </div>
                                ) : null}

                                <div className="flex justify-end gap-2">
                                    {!passwordToken ? (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                router.visit('/reset-password/olvide-password')
                                            }
                                        >
                                            Ir a recuperacion
                                        </Button>
                                    ) : null}
                                    <Button
                                        type="button"
                                        onClick={() => goToStep(2)}
                                        disabled={!passwordToken}
                                    >
                                        Continuar
                                    </Button>
                                </div>
                            </motion.div>
                        ) : null}

                        {step === 2 ? (
                            <motion.div
                                key="step-2"
                                custom={stepDirection}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="space-y-4"
                            >
                                <PasswordForm
                                    onSubmit={startOtpFlow}
                                    submitLabel={
                                        processing ? 'Enviando codigo...' : 'Enviar codigo OTP'
                                    }
                                    disabled={processing}
                                    serverErrors={errors}
                                    className="mx-1 mt-1"
                                />

                                <div className="flex justify-start">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={processing}
                                        onClick={() => {
                                            clearErrors();
                                            goToStep(1);
                                        }}
                                    >
                                        Volver
                                    </Button>
                                </div>
                            </motion.div>
                        ) : null}

                        {step === 3 ? (
                            <motion.div
                                key="step-3"
                                custom={stepDirection}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="space-y-4"
                            >
                                <p className="text-muted-foreground text-sm">
                                    Ingresa el codigo OTP de 6 digitos enviado a tu correo.
                                </p>

                                <PasswordOTPForm
                                    password={formValues.password}
                                    confirmPassword={formValues.confirmPassword}
                                    onSubmit={verifyAndSave}
                                    onResend={resendOtp}
                                    submitLabel={
                                        processing ? 'Guardando...' : 'Confirmar cambio'
                                    }
                                    resendLabel="Reenviar codigo"
                                    otpError={otpError}
                                    disabled={processing}
                                />

                                <div className="flex justify-start">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={processing}
                                        onClick={() => {
                                            clearErrors();
                                            goToStep(2);
                                        }}
                                    >
                                        Volver
                                    </Button>
                                </div>
                            </motion.div>
                        ) : null}

                        {step === 4 ? (
                            <motion.div
                                key="step-4"
                                custom={stepDirection}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="space-y-4"
                            >
                                <div className="bg-muted rounded-lg border p-5 text-sm">
                                    <p className="text-lg font-semibold">
                                        Felicidades, se te ha cambiado la contraseña con éxito.
                                    </p>
                                    <p className="text-muted-foreground mt-2 leading-relaxed">
                                        Ahora puedes seguir usando los servicios de SICMO.
                                        Presiona continuar para finalizar el proceso.
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setOpen(false);
                                            window.location.reload();
                                        }}
                                    >
                                        Continuar
                                    </Button>
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
