import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  children?: React.ReactNode;
  text?: string;
};

export function Button({ text, children, variant = "outline", ...restProps }: ButtonProps) {
    const colorMap = new Map<ButtonVariant, string>([
      ["primary", "border-transparent bg-primary text-primary-foreground"],
      [
        "secondary",
        "border-transparent bg-secondary text-secondary-foreground",
      ],
      [
        "destructive",
        "border-transparent bg-destructive text-destructive-foreground",
      ],
      ["outline", "border-border bg-card"],
    ]);
  return (
    <button
      className={clsx(
        "inline-flex min-h-9 items-center rounded-lg border px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
        colorMap.get(variant),
      )}
      {...restProps}
    >
      {children ?? text}
    </button>
  );
}

