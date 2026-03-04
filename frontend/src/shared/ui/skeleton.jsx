import { cn } from '@/shared/lib/utils';

function Skeleton({ className, ...props }) {
    return (
        <div
            data-slot="skeleton"
            className={cn('bg-slate-200 dark:bg-[#111827] dark:highlight-white/5 animate-pulse rounded-md', className)}
            {...props}
        />
    );
}

export { Skeleton };
