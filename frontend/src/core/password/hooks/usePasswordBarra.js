import { useEffect, useState } from 'react';

export function usePasswordBarra(password, confirmPassword) {
    const [result, setResult] = useState(null);

    useEffect(() => {
        // Lineabase used zxcvbn, but to avoid another dependency at this moment
        // we'll leave this hook logic relying mostly on the regex rules.
        setResult(null); 
    }, [password]);

    const reglas = {
        largo: password?.length >= 8,
        mayusculas: /[A-Z]/.test(password || ''),
        numero: /[0-9]/.test(password || ''),
        caracter: /[^A-Za-z0-9]/.test(password || ''),
        coincide: password && password === confirmPassword,
    };

    const progreso =
        [
            reglas.largo,
            reglas.mayusculas,
            reglas.numero,
            reglas.caracter,
        ].filter(Boolean).length / 4 * 100;

    return { progreso, reglas, result };
}
