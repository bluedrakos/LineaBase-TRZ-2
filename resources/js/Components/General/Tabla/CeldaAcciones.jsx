import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenuSeparator } from "@/Components/ui/dropdown-menu";

export function CeldaAcciones({
    item,
    acciones = []
}) {

    const variant = (variant) => {
        switch (variant) {
            case 'primary':
                return 'text-[#16a34a] hover:text-green-700';
            case 'secondary':
                return 'text-[#004064] hover:text-blue-700';
            case 'danger':
                return 'text-[#b91c1c] hover:text-red-700';
            default:
                return 'text-gray-700 hover:text-gray-800';
        }
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {/* mapeamos las acciones que provienen del arreglo de acciones que hacemos en UsuarioTablaConfig */}
                {acciones.map((accion, separator) => {
                    if (accion.separador) {
                        return <DropdownMenuSeparator key={`separador-${separator}`}></DropdownMenuSeparator>
                    }
                    
                    return (

                        <DropdownMenuItem
                            key={accion.label}
                            onClick={() => accion.onClick(item)}
                            className={`flex justify-between gap-2 ${variant(accion.variant)}`}
                        >
                            <span className="leading-none">{accion.label}</span>
                            {accion.icon && <accion.icon className={`h-4 w-4 mt-[1px] ${variant(accion.variant)}`} />}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
