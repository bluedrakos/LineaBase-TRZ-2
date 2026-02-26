import { Spinner } from "@/Components/ui/spinner";

export default function CargandoDialog({ show = false }) {
    if (!show) return null;

    return (
        <div className="
            absolute inset-0 bg-white/60 backdrop-blur-[2px]
            flex items-center justify-center z-50 rounded-lg
        ">
            <Spinner className="h-8 w-8 animate-spin text-[#004064]" />
        </div>
    );
}
