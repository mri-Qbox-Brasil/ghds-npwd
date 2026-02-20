import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@utils/cn"

const gridVariants = cva(
    "grid",
    {
        variants: {
            cols: {
                1: "grid-cols-1",
                2: "grid-cols-2",
                3: "grid-cols-3",
                4: "grid-cols-4",
                5: "grid-cols-5",
                6: "grid-cols-6",
                12: "grid-cols-12",
                none: "grid-cols-none",
            },
            gap: {
                0: "gap-0",
                1: "gap-1",
                2: "gap-2",
                3: "gap-3",
                4: "gap-4",
                5: "gap-5",
                6: "gap-6",
                8: "gap-8",
                10: "gap-10",
            },
            align: {
                start: "items-start",
                end: "items-end",
                center: "items-center",
                stretch: "items-stretch",
            },
            justify: {
                start: "justify-items-start",
                end: "justify-items-end",
                center: "justify-items-center",
                stretch: "justify-items-stretch",
            },
        },
        defaultVariants: {
            cols: 1,
        },
    }
)

export interface GridProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> { }

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    ({ className, cols, gap, align, justify, ...props }, ref) => {
        return (
            <div
                className={cn(gridVariants({ cols, gap, align, justify, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Grid.displayName = "Grid"

export { Grid, gridVariants }
