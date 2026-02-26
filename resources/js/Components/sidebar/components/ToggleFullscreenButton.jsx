import { Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';

export function ToggleFullscreenButton() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    return (
        <button
            onClick={toggleFullscreen}
            className="hover:bg-muted rounded-md p-2 transition"
            title={
                isFullscreen
                    ? 'Salir de pantalla completa'
                    : 'Pantalla completa'
            }
        >
            {isFullscreen ? (
                <Minimize2 className="size-5" />
            ) : (
                <Maximize2 className="size-5" />
            )}
        </button>
    );
}
