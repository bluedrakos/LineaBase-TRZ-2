import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Input } from '@/Components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronDownIcon, ColumnsIcon, PlusIcon, XIcon } from 'lucide-react';
import React from 'react';
import { FacetedFilter } from './FacetedFilter';
import { PaginationControl } from './PaginationControl';

export function TablaDatosGenerica({
    columns,
    data,
    filterKey = 'nombre',
    onCreate,
}) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    <Input
                        placeholder="Buscar..."
                        value={table.getColumn(filterKey)?.getFilterValue() ?? ''}
                        onChange={(e) =>
                            table
                                .getColumn(filterKey)
                                ?.setFilterValue(e.target.value)
                        }
                        className="h-8 w-[150px] lg:w-[250px]"
                    />

                    {table.getAllColumns().map((column) => {
                        const meta = column.columnDef.meta;
                        // Soportar meta.filterOptions o meta.options (usado en UsuarioTablaConfig)
                        // Soportar meta.filterVariant === 'select' o meta.variant === 'multiSelect'
                        if (meta?.filterOptions || meta?.options || meta?.filterVariant === 'select' || meta?.variant === 'multiSelect') {
                            const uniqueValues = column.getFacetedUniqueValues();
                            const optionsSource = meta.filterOptions || meta.options;
                            
                            const options = optionsSource || Array.from(uniqueValues.keys()).map(val => ({
                                label: val,
                                value: val,
                                count: uniqueValues.get(val)
                            })).filter(opt => opt.value !== null && opt.value !== undefined && opt.value !== "");

                            return (
                                <FacetedFilter
                                    key={column.id}
                                    column={column}
                                    title={column.columnDef.header}
                                    options={options}
                                />
                            );
                        }
                        return null;
                    })}

                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => table.resetColumnFilters()}
                            className="h-8 px-2 lg:px-3"
                        >
                            Limpiar
                            <XIcon className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                                <ColumnsIcon className="mr-2 h-4 w-4" />
                                Columnas
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((col) => col.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                        className="capitalize"
                                    >
                                        {column.columnDef.header}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {onCreate && (
                        <Button variant="outline" size="sm" className="h-8" onClick={onCreate}>
                            <PlusIcon className="mr-2 h-4 w-4" /> Crear
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="px-4 py-2 text-sm font-semibold"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-muted/50 border-b transition-colors last:border-0"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="px-4 py-2 text-sm"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-muted-foreground px-4 py-8 text-center"
                                >
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <PaginationControl table={table} />
        </div>
    );
}
