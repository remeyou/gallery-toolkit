import type { ClassValue } from "clsx"
import { type ReactNode } from "react"
import { cc } from "~utils"

type TittleProps = {
  children: ReactNode
  className?: ClassValue
}

export const H1 = ({ children, className }: TittleProps) => {
  return <h1 className={cc("text-2xl", className)}>{children}</h1>
}

export const H2 = ({ children, className }: TittleProps) => {
  return <h2 className={cc("text-xl", className)}>{children}</h2>
}

export const H3 = ({ children, className }: TittleProps) => {
  return <h3 className={cc("text-lg", className)}>{children}</h3>
}

export const H4 = ({ children, className }: TittleProps) => {
  return <h4 className={cc("text-base", className)}>{children}</h4>
}

export const H5 = ({ children, className }: TittleProps) => {
  return <h5 className={cc("text-sm", className)}>{children}</h5>
}

export const H6 = ({ children, className }: TittleProps) => {
  return <h6 className={cc("text-xs", className)}>{children}</h6>
}

type TextProps = {
  children: ReactNode
  className?: ClassValue
  type?: "secondary"
}

export const Text = ({ children, className, type }: TextProps) => {
  return (
    <span
      className={cc(
        type === "secondary" ? "text-black/50 dark:text-white/50" : "",
        className
      )}>
      {children}
    </span>
  )
}
