import { cn } from '@/lib/utils';
import { forwardRef, useEffect, useState } from 'react';

export const FloatingLabelInput = forwardRef(
    (
        {
            label,
            id,
            className,
            type = 'text',
            onFocus,
            onBlur,
            onChange,
            value,
            defaultValue,
            ...props
        },
        ref,
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [internalValue, setInternalValue] = useState(defaultValue || '');

        useEffect(() => {
            if (value !== undefined) {
                setInternalValue(value);
            }
        }, [value]);

        const hasValue = isFocused || internalValue !== '';

        return (
            <div className="relative">
                <input
                    ref={ref}
                    id={id}
                    type={type}
                    value={value}
                    defaultValue={defaultValue}
                    placeholder=" "
                    onFocus={(e) => {
                        setIsFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    onChange={(e) => {
                        setInternalValue(e.target.value);
                        onChange?.(e);
                    }}
                    className={cn(
                        'peer h-12 w-full rounded border border-[#0e4c75]/30 bg-white px-3 pt-5 pb-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#0e4c75] focus:outline-none dark:border-gray-700 dark:bg-slate-900 dark:focus:ring-[#3b82f6]',
                        className,
                    )}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className={cn(
                        'pointer-events-none absolute left-3 text-gray-500 transition-all duration-200 dark:text-gray-400',
                        hasValue
                            ? 'top-1 text-xs'
                            : 'top-1/2 -translate-y-1/2 text-base',
                    )}
                >
                    {label}
                </label>
            </div>
        );
    },
);
