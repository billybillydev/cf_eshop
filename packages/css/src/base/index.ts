import type { CSSRuleObject } from "tailwindcss/types/config";

export default (): CSSRuleObject => ({
  body: {
    backgroundColor: "hsl(var(--background))",
    color: "hsl(var(--foreground))",
  },
}); 