import { ReactNode, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className, hover = true, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-dark-900/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6',
        {
          'transition-all duration-300 hover:bg-dark-800/50 hover:border-dark-600 hover:scale-105': hover,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}