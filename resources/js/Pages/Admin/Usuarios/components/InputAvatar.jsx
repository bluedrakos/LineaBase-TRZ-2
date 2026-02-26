import { Label } from '@/Components/ui/label';
import { Camera } from 'lucide-react';
import { useState } from 'react';

export default function InputAvatar({ field, error }) {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Solo se permiten archivos JPG o PNG');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen no debe superar los 2MB');
            return;
        }

        field.onChange(file);
        setPreview(URL.createObjectURL(file));
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <Label className="text-muted-foreground text-center text-sm font-medium">
                Avatar
            </Label>

            <label
                htmlFor="usu_avatar"
                className="group border-muted hover:ring-ring relative h-28 w-28 cursor-pointer overflow-hidden rounded-full border shadow hover:ring-2"
            >
                <input
                    id="usu_avatar"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <img
                    src={
                        preview ||
                        'https://ui-avatars.com/api/?name=Usuario&background=0D8ABC&color=fff'
                    }
                    alt="Avatar"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 hidden items-center justify-center bg-black/40 text-white group-hover:flex">
                    <Camera className="h-5 w-5" />
                </div>
            </label>

            {error && (
                <p className="text-center text-xs text-red-500">
                    {error.message}
                </p>
            )}
        </div>
    );
}
