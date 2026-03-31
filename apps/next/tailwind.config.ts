import type { Config } from "tailwindcss";
import eShopCSS from "@eshop/css";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  presets: [eShopCSS],
};

export default config;
