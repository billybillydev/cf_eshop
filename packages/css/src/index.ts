import { type Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import type { PluginAPI } from "tailwindcss/types/config";
import base from "./base";
import components from "./components";

const preset: Config = {
  darkMode: ["class"],
  content: [],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",

        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",

        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",

        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",

        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",

        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",

        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",

        success: "hsl(var(--success))",
        "success-foreground": "hsl(var(--success-foreground))",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, addComponents, theme }: PluginAPI) {
      addBase({
        ...base(),
      });

      addComponents({
        ...components(theme),
      });
    }),
  ],
};

export default preset;
