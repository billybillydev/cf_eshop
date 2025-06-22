import type { CSSRuleObject } from "tailwindcss/types/config";
import type { ThemeProps } from "../types";

export default (theme: ThemeProps): CSSRuleObject => ({
  ".header": {
    backgroundColor: theme("backgroundColor.slate.50"),
    color: theme("textColor.slate.900"),
    display: "flex",
    padding: theme("spacing.8"),

    nav: {
      margin: "0 auto",

      ul: {
        display: "flex",
        columnGap: theme("gap.4"),
        flex: "1 1 0",

        li: {
          display: "flex",
        },
      },
    },
  },

  ".menu-link": {
    borderWidth: "1px",
    borderStyle: "solid",
    display: "flex",
    padding: theme("spacing.2"),
    alignItems: "center",
    justifyContent: "center",

    ".active-link": {
      textDecoration: "underline",
      textUnderlineOffset: "4px",
      borderColor: "transparent",
    },

    ".inactive-link": {
      borderColor: theme("borderColor.slate.800"),
      borderRadius: theme("borderRadius.DEFAULT"),
    },

    ".cart-quantity-container": {
      width: theme("width.8"),
      height: theme("height.8"),
      display: "flex",
      flex: "1 0 auto",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme("borderRadius.full"),
    },

    ".quantity-empty-color": {
      backgroundColor: theme("backgroundColor.slate.800"),
      color: "#fff",
    },

    ".quantity-non-empty-color": {
      backgroundColor: theme("backgroundColor.yellow.500"),
      color: theme("textColor.slate.800"),
    },
  },
});
