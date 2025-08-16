import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  icon?: ReactNode
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  icon,
  className,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950',
        {
          'bg-gradient-primary text-white focus:ring-blue-500': variant === 'primary',
          'bg-gradient-orange text-white focus:ring-orange-500': variant === 'secondary',
          'py-2 px-4 text-sm': size === 'sm',
          'py-3 px-6 text-base': size === 'md',
          'py-4 px-8 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
      {icon && <span className="ml-1">{icon}</span>}
    </button>
  )
}