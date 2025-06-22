import type { CSSRuleObject } from "tailwindcss/types/config";
import type { ThemeProps } from "../types";

export default (theme: ThemeProps): CSSRuleObject => ({
  ".cart-page": {
    "@apply space-y-4 w-full md:w-2/3 xl:w-3/4 border p-2 rounded mx-auto lg:my-4 h-full":
      {},

    ".cart-list": {
      display: "flex",
      flexDirection: "column",
      margin: "0 auto",
      rowGap: theme("gap.4"),

      ".cart-item": {
        display: "flex",
        padding: theme("spacing.2"),
        columnGap: theme("gap.2"),
        borderWidth: "1px",
        borderRadius: theme("borderRadius.DEFAULT"),

        ".cart-item-image": {
          "@apply w-20 xs:w-24 object-cover": {},
        },
        ".cart-item-container": {
          "@apply flex grow flex-col gap-y-2 sm:flex-row md:gap-y-0 self-stretch":
            {},

          ".cart-item-quantity-and-price": {
            "@apply grow flex flex-col items-center sm:items-start": {},
          },

          ".cart-item-actions": {
            "@apply flex md:flex-col justify-between gap-x-4 md:gap-x-0 md:gap-y-2 h-full":
              {},

            ".cart-item-select-quantity-form": {
              display: "flex",
              columnGap: theme("gap.4"),
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            },
          },
        },
      },
    },

    ".cart-total-quantity": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme("spacing.2"),
      fontSize: theme("fontSize.xl"),
      fontWeight: theme("fontWeight.bold"),
    },

    ".cart-total-price": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme("spacing.2"),
      fontSize: theme("fontSize.xl"),
      fontWeight: theme("fontWeight.bold"),
      borderRadius: theme("borderRadius.DEFAULT"),
      backgroundColor: theme("backgroundColor.white"),
      color: theme("textColor.slate.800"),
    },
  },
});
