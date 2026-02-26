
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
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
                    const res = await fetch(`/api/soap/usuarios?nombre=${val}&limit=10`);
                    if (res.ok) {
                        const data = await res.json();
                        setResultadosBusqueda(Array.isArray(data) ? data : [data]);
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
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-800 dark:border-gray-700">
                    {resultadosBusqueda.map((usuario, idx) => (
                        <div
                            key={idx}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => onSelect(usuario)}
                        >
                            <p className="font-medium text-sm">
                                {usuario.pe_nombres || usuario.nombres} {usuario.pe_apellidos || usuario.apellidos}
                            </p>
                            <p className="text-xs text-gray-500">
                                {usuario.pe_rut ? `${usuario.pe_rut}-${usuario.pe_rutdiv}` : (usuario.rut || '')} - {usuario.pe_cargo || ''}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            {error && (
                <p className="text-sm text-[#b91c1c]">
                    {error.message}
                </p>
            )}
        </div>
    );
}
