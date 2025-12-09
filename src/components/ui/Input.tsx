import { InputHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    startIcon?: React.ReactNode
    fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    className,
    label,
    error,
    helperText,
    startIcon,
    fullWidth = true,
    disabled,
    ...props
}, ref) => {
    return (
        <div className={twMerge('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
            {label && (
                <label className="text-xs font-bold text-gray-700 font-display uppercase tracking-wide ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {startIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pp-gold transition-colors duration-200">
                        {startIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        'w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 outline-none transition-all duration-200',
                        'focus:bg-white focus:border-pp-gold focus:ring-4 focus:ring-pp-gold/10',
                        'placeholder:text-gray-400 font-sans',
                        disabled && 'opacity-60 cursor-not-allowed bg-gray-100',
                        startIcon && 'pl-10',
                        error && 'border-red-300 focus:border-red-500 focus:ring-red-100',
                        className
                    )}
                    disabled={disabled}
                    {...props}
                />
            </div>
            {helperText && !error && <span className="text-xs text-gray-500 ml-1">{helperText}</span>}
            {error && <span className="text-xs text-red-500 font-medium ml-1 animate-fade-in-up">{error}</span>}
        </div>
    )
})

Input.displayName = 'Input'

export default Input
