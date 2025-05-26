import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const modernBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset transition-all duration-150",
  {
    variants: {
      variant: {
        default: "bg-slate-700/50 text-slate-200 ring-slate-600",
        success: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
        destructive: "bg-red-500/10 text-red-400 ring-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]",
        warning: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
        primary: "bg-teal-500/10 text-teal-400 ring-teal-500/20 shadow-[0_0_12px_rgba(79,209,197,0.15)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface ModernBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modernBadgeVariants> {}

function ModernBadge({ className, variant, ...props }: ModernBadgeProps) {
  return <div className={cn(modernBadgeVariants({ variant }), className)} {...props} />
}

export { ModernBadge, modernBadgeVariants }
