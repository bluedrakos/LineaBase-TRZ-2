import { useState, useMemo } from "react";
import * as Icons from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

export default function IconPicker({ value, onChange, readOnly = false }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const ALL_ICONS = useMemo(() => {
        return Object.entries(Icons)
            .filter(([name, Icon]) => {
                if (
                    name === "createLucideIcon" ||
                    name === "default" ||
                    name === "__esModule"
                ) return false;

                if (name.endsWith("Icon")) return false;

                return Icon?.$$typeof === Symbol.for("react.forward_ref");
            })
            .map(([name, Icon]) => ({ name, Icon }));
    }, []);



    const filtered = ALL_ICONS.filter((icon) =>
        icon.name.toLowerCase().includes(search.toLowerCase())
    );

    const SelectedIcon = ALL_ICONS.find((i) => i.name === value)?.Icon;

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 border rounded-md flex justify-center items-center bg-white dark:bg-gray-950 text-foreground">
                    {SelectedIcon ? (
                        <SelectedIcon className="h-5 w-5" />
                    ) : (
                        <Icons.HelpCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                </div>

                <Button 
                    className="flex-1" 
                    variant="outline" 
                    onClick={() => { if (!readOnly) setOpen(true) }} 
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

                    <div className="grid grid-cols-6 md:grid-cols-8 gap-4 max-h-[400px] overflow-y-auto p-1">
                        {filtered.map(({ name, Icon }) => (
                            <button
                                key={name}
                                className="flex flex-col items-center justify-center aspect-square p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                onClick={() => {
                                    onChange(name);
                                    setOpen(false);
                                }}
                            >
                                <Icon className="h-6 w-6 mb-1" />
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
