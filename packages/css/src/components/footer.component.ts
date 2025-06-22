import type { CSSRuleObject } from "tailwindcss/types/config";
import type { ThemeProps } from "../types";

export default (theme: ThemeProps): CSSRuleObject => ({
  ".footer": {
    padding: theme("spacing.2"),
    borderWidth: "1px",
    borderStyle: "solid",
    bottom: "0",

    p: {
      textAlign: "center",
    },
  },
});
