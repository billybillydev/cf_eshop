import type { CSSRuleObject } from "tailwindcss/types/config";
import type { ThemeProps } from "../types";

export default (theme: ThemeProps): CSSRuleObject => ({
  ".root-layout": {
    backgroundColor: theme("backgroundColor.slate.800"),
    color: "white",
    display: "flex",
    flexDirection: "column",
    height: "100vh",

    ".content": {
      display: "flex",
      flexDirection: "column",
      flexGrow: "1",
    },

    ".page-title": {
      textAlign: "center",
      padding: `${theme("spacing.8")} 0`,
    },
  },
});