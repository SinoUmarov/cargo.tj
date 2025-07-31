"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring/50 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 aria-invalid:border-destructive relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow hover:shadow-md focus-visible:ring-destructive/30",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        premium:
          "bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 text-white hover:shadow-lg hover:brightness-110",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-11 rounded-lg px-6 text-base has-[>svg]:px-4",
        icon: "size-10 rounded-lg",
        iconSm: "size-8 rounded-lg",
        iconLg: "size-12 rounded-lg",
      },
      fullWidth: {
        true: "w-full",
      },
      loading: {
        true: "opacity-75 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  ripple?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      children,
      ripple = true,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const [coords, setCoords] = React.useState({ x: -1, y: -1 });
    const [isRippling, setIsRippling] = React.useState(false);

    React.useEffect(() => {
      if (coords.x !== -1 && coords.y !== -1 && ripple) {
        setIsRippling(true);
        setTimeout(() => setIsRippling(false), 500);
      } else setIsRippling(false);
    }, [coords, ripple]);

    React.useEffect(() => {
      if (!isRippling) setCoords({ x: -1, y: -1 });
    }, [isRippling]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple) {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
      props.onClick?.(e);
    };

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, loading }), className, "relative")}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...props}
      >
        {ripple && isRippling && (
          <motion.span
            className={cn(
              "absolute block h-8 w-8 rounded-full opacity-20",
              variant === "default" && "bg-primary-foreground",
              variant === "destructive" && "bg-destructive-foreground",
              variant === "outline" && "bg-accent-foreground",
              variant === "secondary" && "bg-secondary-foreground",
              variant === "ghost" && "bg-accent-foreground",
              variant === "premium" && "bg-white"
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 10, opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              left: coords.x,
              top: coords.y,
            }}
          />
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="block h-4 w-4 rounded-full border-2 border-current border-t-transparent"
              />
              {loadingText || children}
            </motion.span>
          ) : (
            <motion.span
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>

        {variant === "premium" && (
          <motion.span
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/30 via-orange-500/10 to-pink-500/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
