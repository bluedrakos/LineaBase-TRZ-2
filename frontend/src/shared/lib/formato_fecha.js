export function formatDate(date, opts = {}) {
    if (!date) return '';

    try {
        return new Intl.DateTimeFormat('es-CL', {
            day: opts.day ?? '2-digit',
            month: opts.month ?? '2-digit',
            year: opts.year ?? 'numeric',
            ...opts,
        }).format(new Date(date));
    } catch (_err) {
        return '';
    }
}
