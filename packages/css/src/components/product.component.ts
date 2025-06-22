import type { CSSRuleObject } from "tailwindcss/types/config";
import type { ThemeProps } from "../types";

export default (theme: ThemeProps): CSSRuleObject => ({
  ".product-filters-container": {
    "@apply p-2 flex flex-col w-full border space-y-4": {},

    ".search-term-input": {
      "@apply p-2 w-full md:w-4/5 border rounded mx-auto": {},
    },

    ".filters-container": {
      "@apply flex flex-col items-center md:flex-row md:justify-around gap-4":
        {},

        ".product-filter-select": {
          "@apply w-64 border text-zinc-800 rounded-md shadow-sm border-zinc-200/70": {},
        }
    },
  },

  ".product-list-container": {
    "@apply container mx-auto p-2": {},
  },

  ".product-list": {
    "@apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4": {},
  },

  ".product-item": {
    "@apply border shadow-md rounded-md": {},

    img: {
      width: "100%",
      aspectRatio: "1/1",
      objectFit: "cover"
    },

    ".product-info": {
      "@apply p-2 space-y-4": {},

      ".name-and-price": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        columnGap: theme("gap.8"),

        "span:last-child": {
          fontWeight: theme("fontWeight.bold"),
        },
      },

      ".category-and-supplier-info": {
        "@apply flex flex-col xs:flex-row items-center justify-between flex-wrap":
          {},

        section: {
          display: "flex",
          columnGap: theme("gap.3"),
          alignItems: "center",

          "span:first-child": {
            fontSize: theme("fontSize.xs"),
          },

          "span:last-child": {
            fontSize: theme("fontSize.sm"),
            fontWeight: theme("fontWeight.medium"),
          },
        },
      },

      ".buttons-action": {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
      },
    },
  },

  ".product-detail-container": {
    "@apply container space-y-8 mx-auto py-16 flex flex-col grow": {},

    ".back-to-list-link": {
      "@apply link text-white w-fit": {},
    },

    ".product-detail": {
      "@apply grid grid-cols-1 lg:grid-cols-2 gap-4 items-center": {},

      "& > section": {
        display: "flex",
        flexDirection: "column",
        rowGap: theme("gap.4"),
        border: "1px solid",

        ".name-and-price": {
          "@apply flex flex-col lg:flex-row items-center lg:justify-between lg:gap-x-4":
            {},
        },

        ".category-and-supplier-info": {
          "@apply flex items-center justify-between [&>div]:space-x-2 [&>div>span:first-child]:underline [&>div>span:last-child]:underline-offset-2":
            {},
        },

        ":is(p, p.grow) > span:first-child": {
          textDecoration: "underline",
          textUnderlineOffset: "2px",
        },

        ".select-quantity-form": {
          width: "80%",
          margin: "0 auto",
          rowGap: theme("gap.4"),
          display: "contents",

          ".select-quantity": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            columnGap: theme("gap.4"),
          },
        },
      },
    },
  },

  ".no-products-text": {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: theme("spacing.4"),
    fontSize: theme("fontSize.xl"),
  },
});
