import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';

export default function AccountDataFields({
    register,
    errors,
    setValue,
    watch,
    roles = [],
}) {
    const tipo = watch('usu_tipo');

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Tipo de Usuario */}
            <div>
                <Label htmlFor="usu_tipo">Tipo de usuario</Label>
                <Select
                    onValueChange={(value) => setValue('usu_tipo', value)}
                    value={tipo || ''}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Interno">Interno</SelectItem>
                        <SelectItem value="Externo">Externo</SelectItem>
                    </SelectContent>
                </Select>
                {errors.usu_tipo && (
                    <p className="text-sm text-red-500">
                        {errors.usu_tipo.message}
                    </p>
                )}
            </div>

            {/* LDAP (Condicional) */}
            {tipo === 'Interno' && (
                <div>
                    <Label htmlFor="usu_ldap">Usuario LDAP</Label>
                    <Input
                        id="usu_ldap"
                        readOnly
                        {...register('usu_ldap')}
                        className="cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                    />
                    {errors.usu_ldap && (
                        <p className="text-sm text-red-500">
                            {errors.usu_ldap.message}
                        </p>
                    )}
                </div>
            )}

            {/* Rol */}
            <div>
                <Label htmlFor="rol_id">Rol</Label>
                <Select
                    onValueChange={(value) =>
                        setValue('rol_id', parseInt(value))
                    }
                    value={watch('rol_id')?.toString() || ''}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((rol) => (
                            <SelectItem
                                key={rol.rol_id}
                                value={rol.rol_id.toString()}
                            >
                                {rol.rol_nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
