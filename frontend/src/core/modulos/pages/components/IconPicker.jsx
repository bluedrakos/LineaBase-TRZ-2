import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import * as Icons from 'lucide-react';
import { useMemo, useState } from 'react';

export default function IconPicker({ value, onChange, readOnly = false }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const ALL_ICONS = useMemo(() => {
        return Object.entries(Icons)
            .filter(([name, Icon]) => {
                if (
                    name === 'createLucideIcon' ||
                    name === 'default' ||
                    name === '__esModule'
                )
                    return false;

                if (name.endsWith('Icon')) return false;

                return Icon?.$$typeof === Symbol.for('react.forward_ref');
            })
            .map(([name, Icon]) => ({ name, Icon }));
    }, []);

    const filtered = ALL_ICONS.filter((icon) =>
        icon.name.toLowerCase().includes(search.toLowerCase()),
    );

    const SelectedIcon = ALL_ICONS.find((i) => i.name === value)?.Icon;

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="text-foreground flex h-10 w-10 items-center justify-center rounded-md border bg-white dark:bg-gray-950">
                    {SelectedIcon ? (
                        <SelectedIcon className="h-5 w-5" />
                    ) : (
                        <Icons.HelpCircle className="text-muted-foreground h-5 w-5" />
                    )}
                </div>

                <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => {
                        if (!readOnly) setOpen(true);
                    }}
                    disabled={readOnly}
                    type="button"
                >
                    Seleccionar ícono
                </Button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Seleccionar ícono</DialogTitle>
                    </DialogHeader>

                    <DialogDescription>
                        Busca o selecciona un ícono de la lista.
                    </DialogDescription>

                    <Input
                        placeholder="Buscar icono…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-4"
                    />

                    <div className="grid max-h-[400px] grid-cols-6 gap-4 overflow-y-auto p-1 md:grid-cols-8">
                        {filtered.map(({ name, Icon }) => (
                            <button
                                key={name}
                                className="flex aspect-square flex-col items-center justify-center rounded-md border p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={() => {
                                    onChange(name);
                                    setOpen(false);
                                }}
                            >
                                <Icon className="mb-1 h-6 w-6" />
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
