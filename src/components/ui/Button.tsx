import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    startIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    startIcon,
    children,
    disabled,
    ...props
}, ref) => {

    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none font-display uppercase tracking-wide active:scale-95 duration-75'

    const variants = {
        primary: 'bg-pp-gold text-pp-brown hover:bg-pp-gold/80 hover:shadow-lg hover:-translate-y-0.5 shadow-md shadow-pp-gold/20 focus:ring-pp-gold',
        secondary: 'bg-white text-pp-brown border border-gray-200 hover:bg-gray-50 hover:border-pp-gold/30 shadow-sm focus:ring-pp-gold',
        outline: 'border-2 border-pp-gold text-pp-brown hover:bg-pp-gold/10 focus:ring-pp-gold',
        ghost: 'text-pp-brown hover:bg-pp-brown/5 hover:text-pp-gold focus:ring-pp-brown/20',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 focus:ring-red-500'
    }

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base'
    }

    return (
        <button
            ref={ref}
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isLoading && startIcon && <span className="mr-2">{startIcon}</span>}
            {children}
        </button>
    )
})

Button.displayName = 'Button'

export default Button
