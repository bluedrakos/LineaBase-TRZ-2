import { Button } from '@/shared/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Input } from '@/shared/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table';
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
    isLoading = false,
}) {
    if (isLoading) {
        return (
            <div className="w-full space-y-4 py-4 animate-in fade-in duration-500">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="h-8 w-full md:w-[250px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-md shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 dark:via-slate-800/50 to-transparent"></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-8 w-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-md shadow-sm relative overflow-hidden hidden sm:block">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 dark:via-slate-800/50 to-transparent"></div>
                        </div>
                        {onCreate && (
                            <div className="h-8 w-28 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-md shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 dark:via-slate-800/50 to-transparent"></div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="rounded-md border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="h-10 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 dark:via-slate-800/50 to-transparent"></div>
                        <div className="w-full flex gap-6">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="flex-1 h-3 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse"></div>)}
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-[52px] flex items-center px-4 gap-6 relative overflow-hidden bg-white dark:bg-slate-900 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 dark:via-slate-800/50 to-transparent"></div>
                                {[1, 2, 3, 4, 5].map(j => <div key={j} className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>)}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-4">
                    <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded relative overflow-hidden hidden sm:block">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 dark:via-slate-800/50 to-transparent"></div>
                    </div>
                    <div className="flex gap-2">
                         {[1, 2, 3, 4].map(i => <div key={i} className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded relative overflow-hidden">
                             <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50/50 dark:via-slate-800/50 to-transparent"></div>
                         </div>)}
                    </div>
                </div>
            </div>
        );
    }

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
                        value={
                            table.getColumn(filterKey)?.getFilterValue() ?? ''
                        }
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
                        if (
                            meta?.filterOptions ||
                            meta?.options ||
                            meta?.filterVariant === 'select' ||
                            meta?.variant === 'multiSelect'
                        ) {
                            const uniqueValues =
                                column.getFacetedUniqueValues();
                            const optionsSource =
                                meta.filterOptions || meta.options;

                            const options =
                                optionsSource ||
                                Array.from(uniqueValues.keys())
                                    .map((val) => ({
                                        label: val,
                                        value: val,
                                        count: uniqueValues.get(val),
                                    }))
                                    .filter(
                                        (opt) =>
                                            opt.value !== null &&
                                            opt.value !== undefined &&
                                            opt.value !== '',
                                    );

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
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={onCreate}
                        >
                            <PlusIcon className="mr-2 h-4 w-4" /> Crear
                        </Button>
                    )}
                </div>
            </div>

            <div className="overflow-hidden rounded-md border">
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
                                                  header.column.columnDef
                                                      .header,
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
