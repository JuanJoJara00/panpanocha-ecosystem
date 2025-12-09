import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, hover = false, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={twMerge(
                'bg-white rounded-xl border border-gray-100 shadow-sm p-6 transition-all duration-300',
                hover && 'hover:shadow-md hover:shadow-pp-gold/10 hover:border-pp-gold/30 cursor-pointer hover:-translate-y-0.5',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
})

Card.displayName = 'Card'

export default Card
