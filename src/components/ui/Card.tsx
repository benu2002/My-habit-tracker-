import * as React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/src/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  glass?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = true, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={cn(
          "rounded-2xl border bg-white text-slate-950 shadow-sm dark:bg-slate-900 dark:text-slate-50",
          glass &&
            "bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-white/20 dark:border-slate-800/50 shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

export { Card };
