import type { CSSRuleObject } from "tailwindcss/types/config";

export default (): CSSRuleObject => ({
  "align-col": {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
});