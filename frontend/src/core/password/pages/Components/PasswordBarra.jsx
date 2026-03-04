export default function PasswordStrengthBar({ progreso, coincide }) {
    return (
        <div className="mt-2">
            <div className="h-2 w-full rounded bg-gray-200">
                <div
                    className="h-2 rounded transition-all"
                    style={{
                        width: `${progreso}%`,
                        backgroundColor:
                            progreso < 50
                                ? 'red'
                                : progreso < 75
                                  ? 'orange'
                                  : 'green',
                    }}
                />
            </div>
            <p className="mt-1 text-sm text-gray-600">
                {progreso === 100 && coincide
                    ? 'Contraseña exitosa'
                    : progreso === 100
                      ? 'Ahora confirma tu contraseña'
                      : 'Sigue completando los requisitos'}
            </p>
        </div>
    );
}
