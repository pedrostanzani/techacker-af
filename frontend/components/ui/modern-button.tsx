import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const modernButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-base font-medium ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-teal-400 text-slate-900 hover:bg-teal-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(79,209,197,0.3)] active:translate-y-0",
        destructive:
          "bg-red-500 text-slate-50 hover:bg-red-400 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(239,68,68,0.3)]",
        outline:
          "border border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-slate-50 hover:-translate-y-0.5",
        secondary: "bg-slate-700 text-slate-200 hover:bg-slate-600 hover:-translate-y-0.5",
        ghost: "hover:bg-slate-800 hover:text-slate-50 text-slate-300",
        link: "text-teal-400 underline-offset-4 hover:underline hover:text-teal-300",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-lg px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ModernButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof modernButtonVariants> {
  asChild?: boolean
  loading?: boolean
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(modernButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Analisando...</span>
          </div>
        ) : (
          children
        )}
      </Comp>
    )
  },
)
ModernButton.displayName = "ModernButton"

export { ModernButton, modernButtonVariants }
