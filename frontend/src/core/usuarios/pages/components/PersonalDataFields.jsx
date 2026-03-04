import { formatearRut, limpiarRut } from '@/shared/schemas/usuario.schema.js';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export default function PersonalDataFields({
    register,
    errors,
    setValue,
    watch,
    setLoading,
    onSelectSoap,
}) {
    const rut_display = watch('usu_rut_display');

    const handleRutBlur = async () => {
        const rut = watch('usu_rut');
        if (rut && rut.length >= 7) {
            try {
                setLoading(true);
                const response = await fetch(`/api/soap/usuarios?rut=${rut}`);
                if (response.ok) {
                    const data = await response.json();
                    onSelectSoap(data);
                }
            } catch (error) {
                console.error('Error al consultar Agenda:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Apellidos */}
            <div>
                <Label htmlFor="usu_apellidos">Apellidos</Label>
                <Input id="usu_apellidos" {...register('usu_apellidos')} />
                {errors.usu_apellidos && (
                    <p className="text-sm text-[#b91c1c]">
                        {errors.usu_apellidos.message}
                    </p>
                )}
            </div>

            {/* RUT */}
            <div>
                <Label htmlFor="usu_rut">RUT</Label>
                <Input
                    id="usu_rut"
                    value={rut_display || ''}
                    onChange={(e) => {
                        let raw = e.target.value.replace(/\D/g, '');
                        if (raw.length > 9) raw = raw.slice(0, 9);
                        setValue('usu_rut', limpiarRut(raw));
                        setValue('usu_rut_display', formatearRut(raw));
                    }}
                    onBlur={handleRutBlur}
                    placeholder="11.111.111-1"
                />
                {errors.usu_rut && (
                    <p className="text-sm text-red-500">
                        {errors.usu_rut.message}
                    </p>
                )}
            </div>

            {/* Correo */}
            <div>
                <Label htmlFor="usu_correo">Correo</Label>
                <Input
                    id="usu_correo"
                    type="email"
                    {...register('usu_correo')}
                />
                {errors.usu_correo && (
                    <p className="text-sm text-[#b91c1c]">
                        {errors.usu_correo.message}
                    </p>
                )}
            </div>

            {/* Teléfono */}
            <div>
                <Label htmlFor="usu_telefono">Teléfono</Label>
                <Input
                    id="usu_telefono"
                    value={watch('usu_telefono') || ''}
                    placeholder="12345678"
                    onChange={(e) => {
                        setValue(
                            'usu_telefono',
                            e.target.value.replace(/\D/g, ''),
                        );
                    }}
                />
                {errors.usu_telefono && (
                    <p className="text-sm text-red-500">
                        {errors.usu_telefono.message}
                    </p>
                )}
            </div>
        </div>
    );
}
