import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function truncate(text, length = 20) {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
}
