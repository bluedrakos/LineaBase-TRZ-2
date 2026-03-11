import { Button } from '@/shared/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import { usePage } from '@/shared/app-bridge';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import PasswordForm from './components/PasswordForm';
import PasswordOTPForm from './components/PasswordOTPForm';

export default function NuevaPassword({ token }) {
    const { props } = usePage();
    const [step, setStep] = useState(1);
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        if (props.flash?.success) toast.success(props.flash.success);
        if (props.flash?.error) toast.error(props.flash.error);
    }, [props.flash]);

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="h-auto w-[600px]">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between">
                            <CardTitle className="text-lg">
                                Reestablecer Contraseña
                            </CardTitle>
                            {step === 2 && (
                                <Button
                                    onClick={() => setStep(1)}
                                    variant="link"
                                    className="flex items-center"
                                >
                                    <ChevronLeft />
                                    <CardTitle className="text-sm">
                                        Volver al paso anterior
                                    </CardTitle>
                                </Button>
                            )}
                        </div>
                        <CardDescription className="text-lg">
                            {step === 1
                                ? 'Configura tu nueva contraseña.'
                                : 'Ingresa el código que enviamos a tu correo.'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {step === 1 ? (
                            <PasswordForm
                                token={token}
                                onSuccess={(values) => {
                                    setFormValues(values);
                                    setStep(2);
                                }}
                            />
                        ) : (
                            <PasswordOTPForm
                                token={token}
                                password={formValues.password}
                                confirmPassword={formValues.confirmPassword}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
            <Toaster richColors position="top-right" />
        </div>
    );
}
