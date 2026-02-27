import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@utils/cn"

const typographyVariants = cva(
    "text-foreground",
    {
        variants: {
            variant: {
                h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
                h2: "scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
                h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
                h4: "scroll-m-20 text-xl font-semibold tracking-tight",
                h5: "scroll-m-20 text-lg font-semibold tracking-tight",
                h6: "scroll-m-20 text-base font-semibold tracking-tight",
                body1: "text-base leading-7 [&:not(:first-child)]:mt-6",
                body2: "text-sm",
                subtitle1: "text-base font-medium",
                subtitle2: "text-sm font-medium",
                button: "text-sm font-medium uppercase",
                caption: "text-xs text-muted-foreground",
                overline: "text-[10px] uppercase tracking-wider text-muted-foreground",
            },
            align: {
                left: "text-left",
                center: "text-center",
                right: "text-right",
                justify: "text-justify",
            },
            weight: {
                light: "font-light",
                normal: "font-normal",
                medium: "font-medium",
                semibold: "font-semibold",
                bold: "font-bold",
                extrabold: "font-extrabold",
            },
            color: {
                default: "text-foreground",
                primary: "text-primary",
                secondary: "text-secondary",
                muted: "text-muted-foreground",
                destructive: "text-destructive",
                success: "text-green-500", // Tailwind core color if needed
                inherit: "text-inherit",
            },
            noWrap: {
                true: "truncate whitespace-nowrap",
            }
        },
        defaultVariants: {
            variant: "body1",
            color: "default",
            align: "left",
        },
    }
)

export interface TypographyProps
    extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement>,
    VariantProps<typeof typographyVariants> {
    component?: React.ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant, align, weight, color, noWrap, component, ...props }, ref) => {
        // Map MUI-like variants to native HTML tags if component is not provided
        const Component = component || (() => {
            switch (variant) {
                case 'h1': return 'h1';
                case 'h2': return 'h2';
                case 'h3': return 'h3';
                case 'h4': return 'h4';
                case 'h5': return 'h5';
                case 'h6': return 'h6';
                case 'body1':
                case 'body2': return 'p';
                case 'caption':
                case 'overline':
                case 'button': return 'span';
                default: return 'p';
            }
        })();

        return (
            <Component
                ref={ref as any}
                className={cn(typographyVariants({ variant, align, weight, color: color as any, noWrap, className }))}
                {...props}
            />
        )
    }
)
Typography.displayName = "Typography"

export { Typography, typographyVariants }
