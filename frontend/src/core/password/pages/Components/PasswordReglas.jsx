import { Check, X } from 'lucide-react';

export default function PasswordRules({ reglas }) {
    const items = [
        { key: 'largo', label: 'Al menos 8 caracteres' },
        { key: 'mayusculas', label: 'Al menos 1 mayúscula' },
        { key: 'numero', label: 'Al menos 1 número' },
        { key: 'caracter', label: 'Al menos 1 carácter especial' },
        { key: 'coincide', label: 'Las contraseñas deben coincidir' },
    ];

    return (
        <ul className="mt-2 space-y-1 text-sm">
            {items.map(({ key, label }) => (
                <li
                    key={key}
                    className={`flex items-center gap-2 font-medium ${
                        reglas[key] ? 'text-green-600' : 'text-red-500'
                    }`}
                >
                    {reglas[key] ? <Check size={18} /> : <X size={18} />}
                    {label}
                </li>
            ))}
        </ul>
    );
}
