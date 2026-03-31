import type { CSSRuleObject } from "tailwindcss/types/config";
import type { ThemeProps } from "../types";

export default (theme: ThemeProps): CSSRuleObject => ({
  ".card": {
    borderRadius: "calc(var(--radius) + 0.25rem)",
    borderWidth: "1px",
    backgroundColor: "hsl(var(--card))",
    color: "hsl(var(--card-foreground))",
    boxShadow: theme("boxShadow.sm"),
  },
  ".input": {
    height: theme("spacing.10"),
    width: "100%",
    borderRadius: "calc(var(--radius) - 0.25rem)",
    borderWidth: "1px",
    backgroundColor: "hsl(var(--background))",
    paddingLeft: theme("spacing.3"),
    paddingRight: theme("spacing.3"),
    fontSize: theme("fontSize.sm"),
    boxShadow: theme("boxShadow.sm"),
    outline: "none",
  },
  ".input:focus": {
    boxShadow: `0 0 0 2px hsl(var(--ring))`,
  },
  ".btn": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "calc(var(--radius) - 0.25rem)",
    height: theme("spacing.10"),
    paddingLeft: theme("spacing.4"),
    paddingRight: theme("spacing.4"),
    fontSize: theme("fontSize.sm"),
    fontWeight: theme("fontWeight.medium"),
    boxShadow: theme("boxShadow.sm"),
  },
  ".btn-primary": {
    backgroundColor: "hsl(var(--primary))",
    color: "hsl(var(--primary-foreground))",
  },
  ".btn-primary:hover": {
    opacity: "0.95",
  },
  ".btn-secondary": {
    backgroundColor: "hsl(var(--secondary))",
    color: "hsl(var(--secondary-foreground))",
  },
  ".btn-ghost:hover": {
    backgroundColor: "hsl(var(--accent))",
    color: "hsl(var(--accent-foreground))",
  },
});
