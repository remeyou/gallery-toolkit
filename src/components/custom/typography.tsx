import type { ClassValue } from "clsx";
import { type ReactNode } from "react";
import { cn } from "~lib/utils";

type TypographyProps = {
  children: ReactNode;
  className?: ClassValue;
};

export const H3 = ({ children, className }: TypographyProps) => {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
};

export const H4 = ({ children, className }: TypographyProps) => {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h4>
  );
};

export const H5 = ({ children, className }: TypographyProps) => {
  return (
    <h5
      className={cn(
        "scroll-m-20 text-lg font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h5>
  );
};

export const P = ({ children, className }: TypographyProps) => {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
};

export const Muted = ({ children, className }: TypographyProps) => {
  return (
    <span className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </span>
  );
};

export const InlineCode = ({ children, className }: TypographyProps) => {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className,
      )}
    >
      {children}
    </code>
  );
};
