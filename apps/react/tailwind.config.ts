import eShopCSS from "@eshop/css";
import { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [eShopCSS],
} satisfies Config;
