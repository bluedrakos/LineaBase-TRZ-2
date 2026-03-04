import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useState } from 'react';

export default function SoapUserSearch({ onSelect, error, register }) {
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [mostrandoResultados, setMostrandoResultados] = useState(false);

    const handleSearch = (e) => {
        const val = e.target.value;
        if (val.length > 2) {
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(async () => {
                try {
                    const res = await fetch(
                        `/api/soap/usuarios?nombre=${val}&limit=10`,
                    );
                    if (res.ok) {
                        const data = await res.json();
                        setResultadosBusqueda(
                            Array.isArray(data) ? data : [data],
                        );
                        setMostrandoResultados(true);
                    }
                } catch (err) {
                    console.error(err);
                }
            }, 500);
        } else {
            setMostrandoResultados(false);
        }
    };

    return (
        <div className="relative">
            <Label htmlFor="usu_nombre">Nombre</Label>
            <Input
                id="usu_nombre"
                autoComplete="off"
                {...register('usu_nombre')}
                onChange={(e) => {
                    register('usu_nombre').onChange(e); // Mantener el registro de react-hook-form
                    handleSearch(e);
                }}
                onBlur={(e) => {
                    register('usu_nombre').onBlur(e);
                    // Pequeño delay para permitir click en la lista
                    setTimeout(() => setMostrandoResultados(false), 200);
                }}
            />
            {mostrandoResultados && resultadosBusqueda.length > 0 && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    {resultadosBusqueda.map((usuario, idx) => (
                        <div
                            key={idx}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => onSelect(usuario)}
                        >
                            <p className="text-sm font-medium">
                                {usuario.pe_nombres || usuario.nombres}{' '}
                                {usuario.pe_apellidos || usuario.apellidos}
                            </p>
                            <p className="text-xs text-gray-500">
                                {usuario.pe_rut
                                    ? `${usuario.pe_rut}-${usuario.pe_rutdiv}`
                                    : usuario.rut || ''}{' '}
                                - {usuario.pe_cargo || ''}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            {error && <p className="text-sm text-[#b91c1c]">{error.message}</p>}
        </div>
    );
}
