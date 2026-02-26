import { useEffect, useState } from 'react';
import zxcvbn from 'zxcvbn';

export function usePasswordBarra(password, confirmPassword) {
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (password) setResult(zxcvbn(password));
        else setResult(null);
    }, [password]);

    const reglas = {
        largo: password?.length >= 8,
        mayusculas: /[A-Z]/.test(password || ''),
        numero: /[0-9]/.test(password || ''),
        caracter: /[^A-Za-z0-9]/.test(password || ''),
        coincide: password && password === confirmPassword,
    };

    const progreso =
        // eslint-disable-next-line prettier/prettier
        [
            reglas.largo,
            reglas.mayusculas,
            reglas.numero,
            reglas.caracter,
            // eslint-disable-next-line prettier/prettier
        ].filter(Boolean).length / 4 * 100;

    return { progreso, reglas, result };
}
