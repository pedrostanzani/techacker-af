import * as React from "react"
import { cn } from "@/lib/utils"

export interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-base text-slate-50 placeholder:text-slate-400 focus:border-teal-400 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 shadow-inner",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
ModernInput.displayName = "ModernInput"

export { ModernInput }
