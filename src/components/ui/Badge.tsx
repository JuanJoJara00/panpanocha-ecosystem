import { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
    size?: 'sm' | 'md'
}

export default function Badge({ className, variant = 'neutral', size = 'md', children, ...props }: BadgeProps) {
    const variants = {
        success: 'bg-green-50 text-green-700 border-green-100',
        warning: 'bg-pp-gold/20 text-pp-brown border-pp-gold/30',
        error: 'bg-red-50 text-red-700 border-red-100',
        info: 'bg-blue-50 text-blue-700 border-blue-100',
        neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    }

    const sizes = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs'
    }

    return (
        <span
            className={twMerge(
                'inline-flex items-center rounded-full font-medium border',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    )
}
