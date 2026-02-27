import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@utils/cn"

const flexVariants = cva(
    "flex",
    {
        variants: {
            direction: {
                row: "flex-row",
                col: "flex-col",
                rowReverse: "flex-row-reverse",
                colReverse: "flex-col-reverse",
            },
            align: {
                start: "items-start",
                end: "items-end",
                center: "items-center",
                baseline: "items-baseline",
                stretch: "items-stretch",
            },
            justify: {
                start: "justify-start",
                end: "justify-end",
                center: "justify-center",
                between: "justify-between",
                around: "justify-around",
                evenly: "justify-evenly",
            },
            wrap: {
                nowrap: "flex-nowrap",
                wrap: "flex-wrap",
                wrapReverse: "flex-wrap-reverse",
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
        },
        defaultVariants: {
            direction: "row",
        },
    }
)

export interface FlexProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> { }

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
    ({ className, direction, align, justify, wrap, gap, ...props }, ref) => {
        return (
            <div
                className={cn(flexVariants({ direction, align, justify, wrap, gap, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Flex.displayName = "Flex"

export { Flex, flexVariants }
