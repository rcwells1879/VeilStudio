import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export default function Container({ children, className, size = 'xl' }: ContainerProps) {
  return (
    <div
      className={clsx(
        'mx-auto px-4 sm:px-6 lg:px-8',
        {
          'max-w-3xl': size === 'sm',
          'max-w-4xl': size === 'md',
          'max-w-6xl': size === 'lg',
          'max-w-7xl': size === 'xl',
          'max-w-none': size === 'full',
        },
        className
      )}
    >
      {children}
    </div>
  )
}