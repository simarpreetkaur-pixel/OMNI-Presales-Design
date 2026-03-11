import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap font-medium tracking-[0.2px] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-purple-200 text-purple-700",
        secondary: "bg-onyx-200 text-onyx-600",
        destructive: "bg-cerise-200 text-cerise-700",
        outline: "bg-transparent shadow-[inset_0_0_0_1px_currentColor]",
        success: "bg-green-200 text-green-700",
        warning: "bg-orange-200 text-orange-700",
        info: "bg-blue-200 text-blue-700",
        pink: "bg-cerise-200 text-cerise-700",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px] rounded",
        default: "px-2.5 py-1 text-xs rounded-md",
        lg: "px-3 py-1.5 text-sm rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
