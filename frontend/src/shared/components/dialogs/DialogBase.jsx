import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';

export default function DialogBase({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer = null,
    className = '',
    readOnly = false,
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={` ${className}`}
                onInteractOutside={(e) => e.preventDefault()} // <- evita cierre por clic fuera
            >
                <DialogHeader>
                    <DialogTitle>
                        <span className="flex items-center gap-3">
                            <span>{title}</span>
                            {readOnly && (
                                <span className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-800">
                                    Solo lectura
                                </span>
                            )}
                        </span>
                    </DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>

                <div className="py-2">{children}</div>

                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    );
}
