import { Button } from '@/shared/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export function CeldaAcciones({ item, acciones = [] }) {
    const variant = (variant) => {
        switch (variant) {
            case 'primary':
                return 'text-[#16a34a] hover:text-green-700 dark:text-green-400 dark:hover:text-green-300';
            case 'secondary':
                return 'text-[#004064] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300';
            case 'danger':
                return 'text-[#b91c1c] hover:text-red-700 dark:text-red-400 dark:hover:text-red-300';
            default:
                return 'text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100';
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
                {acciones
                    .reduce((acc, current) => {
                        // Evitar separadores al inicio o consecutivos
                        if (current.separador) {
                            if (acc.length > 0 && !acc[acc.length - 1].separador) {
                                acc.push(current);
                            }
                        } else {
                            acc.push(current);
                        }
                        return acc;
                    }, [])
                    // Evitar separador al final
                    .filter((accion, index, arr) => {
                        if (accion.separador && index === arr.length - 1) {
                            return false;
                        }
                        return true;
                    })
                    .map((accion, separator) => {
                    if (accion.separador) {
                        return (
                            <DropdownMenuSeparator
                                key={`separador-${separator}`}
                            ></DropdownMenuSeparator>
                        );
                    }

                    return (
                        <DropdownMenuItem
                            key={accion.label}
                            onClick={() => accion.onClick(item)}
                            className={`flex justify-between gap-2 ${variant(accion.variant)}`}
                        >
                            <span className="leading-none">{accion.label}</span>
                            {accion.icon && (
                                <accion.icon
                                    className={`mt-[1px] h-4 w-4 ${variant(accion.variant)}`}
                                />
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
