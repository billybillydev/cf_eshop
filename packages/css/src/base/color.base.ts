import type { CSSRuleObject } from "tailwindcss/types/config";
import type { ThemeProps } from "../types";

export default (theme: ThemeProps): CSSRuleObject => ({
    ".bg-foreground": {
        backgroundColor: theme("backgroundColor.slate.800")
    },
    ".text-foreground": {
        color: theme("textColor.slate.800")
    },
}) 