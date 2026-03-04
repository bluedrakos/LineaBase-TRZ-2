import { Spinner } from '@/shared/ui/spinner';

export default function CargandoDialog({ show = false }) {
    if (!show) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-[2px]">
            <Spinner className="h-8 w-8 animate-spin text-[#004064]" />
        </div>
    );
}
