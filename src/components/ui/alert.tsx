"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { X, AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-1 items-start [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current shadow-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border/50",
        destructive:
          "border-destructive/20 bg-destructive/5 text-destructive [&>svg]:text-destructive",
        warning:
          "border-warning/20 bg-warning/5 text-warning [&>svg]:text-warning",
        success:
          "border-success/20 bg-success/5 text-success [&>svg]:text-success",
        info: "border-info/20 bg-info/5 text-info [&>svg]:text-info",
      },
      elevation: {
        flat: "shadow-none",
        low: "shadow-sm",
        medium: "shadow-md",
        high: "shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      elevation: "low",
    },
  }
);

const iconVariants = {
  default: Info,
  destructive: AlertCircle,
  warning: TriangleAlert,
  success: CheckCircle2,
  info: Info,
};

interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

function Alert({
  className,
  variant = "default",
  elevation,
  dismissible = false,
  onDismiss,
  icon,
  children,
  ...props
}: AlertProps) {
  const IconComponent = icon ? undefined : iconVariants[variant || "default"];

  return (
    <AnimatePresence>
      <motion.div
        data-slot="alert"
        role="alert"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={cn(alertVariants({ variant, elevation, className }))}
        {...props}
      >
        {/* Glow effect */}
        <div
          className={cn(
            "absolute inset-0 -z-10 opacity-10 pointer-events-none",
            variant === "destructive" && "bg-destructive",
            variant === "warning" && "bg-warning",
            variant === "success" && "bg-success",
            variant === "info" && "bg-info"
          )}
        />

        {icon || (IconComponent && <IconComponent className="shrink-0" />)}

        <div className="space-y-1.5 col-start-2">
          {children}
        </div>

        {dismissible && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-2 top-2 rounded-full p-1 h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={onDismiss}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "line-clamp-2 font-medium tracking-tight text-sm flex items-center gap-2",
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm [&_p]:leading-relaxed [&_p]:text-current/80 grid gap-1",
        className
      )}
      {...props}
    />
  );
}

function AlertActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-actions"
      className={cn("flex gap-2 pt-2", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, AlertActions };