import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';

export default function WorkDataFields({
    register,
    errors,
    setValue,
    watch,
    instituciones = [],
}) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Cargo */}
            <div>
                <Label htmlFor="usu_cargo">Cargo</Label>
                <Input id="usu_cargo" {...register('usu_cargo')} />
                {errors.usu_cargo && (
                    <p className="text-sm text-red-500">
                        {errors.usu_cargo.message}
                    </p>
                )}
            </div>

            {/* Gerencia */}
            <div>
                <Label htmlFor="usu_gerencia">Gerencia (Opcional)</Label>
                <Input id="usu_gerencia" {...register('usu_gerencia')} />
                {errors.usu_gerencia && (
                    <p className="text-sm text-[#b91c1c]">
                        {errors.usu_gerencia.message}
                    </p>
                )}
            </div>

            {/* Análisis */}
            <div>
                <Label htmlFor="usu_analisis">Análisis (Opcional)</Label>
                <Input
                    id="usu_analisis"
                    {...register('usu_analisis')}
                    placeholder="Número de análisis"
                />
                {errors.usu_analisis && (
                    <p className="text-sm text-[#b91c1c]">
                        {errors.usu_analisis.message}
                    </p>
                )}
            </div>

            {/* Institución */}
            <div>
                <Label htmlFor="ins_id">Institución</Label>
                <Select
                    onValueChange={(value) =>
                        setValue('ins_id', value === '0' ? '' : parseInt(value))
                    }
                    value={
                        watch('ins_id') === '' || watch('ins_id') === undefined
                            ? '0'
                            : watch('ins_id')?.toString()
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">-- Ninguna --</SelectItem>
                        {instituciones.map((ins) => (
                            <SelectItem
                                key={ins.ins_id}
                                value={ins.ins_id.toString()}
                            >
                                {ins.ins_nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
