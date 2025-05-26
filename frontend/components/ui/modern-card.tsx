import * as React from "react"
import { cn } from "@/lib/utils"

const ModernCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-slate-600/50 bg-gradient-to-br from-slate-800 to-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-150 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:-translate-y-0.5",
        className,
      )}
      {...props}
    />
  ),
)
ModernCard.displayName = "ModernCard"

const ModernCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)} {...props} />
  ),
)
ModernCardHeader.displayName = "ModernCardHeader"

const ModernCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xl font-semibold leading-none tracking-tight text-slate-50", className)}
      {...props}
    />
  ),
)
ModernCardTitle.displayName = "ModernCardTitle"

const ModernCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm text-slate-400", className)} {...props} />,
)
ModernCardDescription.displayName = "ModernCardDescription"

const ModernCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
ModernCardContent.displayName = "ModernCardContent"

export { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardDescription, ModernCardContent }
