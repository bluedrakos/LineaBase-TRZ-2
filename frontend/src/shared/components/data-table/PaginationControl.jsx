import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/shared/ui/pagination';

export function PaginationControl({ table }) {
    const { pageIndex } = table.getState().pagination;
    const totalPages = table.getPageCount();
    const currentPage = pageIndex + 1;

    const totalItems = table.getFilteredRowModel().rows.length;
    const itemsPerPage = table.getState().pagination.pageSize;

    if (totalPages <= 1 && totalItems <= itemsPerPage) return null;

    // Calculate range
    const start = pageIndex * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, totalItems);

    // Logic to show limited page numbers (e.g., 1, 2, ..., current, ... last)
    const getPageNumbers = () => {
        const pages = [];
        // Always show first
        pages.push(1);

        if (currentPage > 3) {
            pages.push('...');
        }

        // Show neighbors
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        // Always show last
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return [...new Set(pages)]; // Remove duplicates for small page counts
    };

    return (
        <div className="mt-4 flex w-full flex-col items-center justify-between gap-4 px-2 md:flex-row">
            {/* Left Side: Info Text */}
            <div className="text-muted-foreground order-2 text-sm md:order-1">
                {totalItems > 0 ? (
                    <>
                        Mostrando{' '}
                        <strong>
                            {start}-{end}
                        </strong>{' '}
                        de <strong>{totalItems}</strong> elementos
                    </>
                ) : (
                    'Sin resultados'
                )}
            </div>

            {/* Right Side: Pagination Controls */}
            <div className="order-1 w-auto md:order-2">
                <Pagination className="mx-0 w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => table.previousPage()}
                                className={
                                    !table.getCanPreviousPage()
                                        ? 'pointer-events-none opacity-50'
                                        : 'cursor-pointer'
                                }
                            />
                        </PaginationItem>

                        {getPageNumbers().map((page, index) => (
                            <PaginationItem key={index}>
                                {page === '...' ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        isActive={currentPage === page}
                                        onClick={() =>
                                            table.setPageIndex(page - 1)
                                        }
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => table.nextPage()}
                                className={
                                    !table.getCanNextPage()
                                        ? 'pointer-events-none opacity-50'
                                        : 'cursor-pointer'
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
