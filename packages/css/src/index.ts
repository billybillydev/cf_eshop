import { type Config } from "tailwindcss";
import mosiUI from "tailwindcss-mosiui-mini";
import plugin from "tailwindcss/plugin";
import type { PluginAPI } from "tailwindcss/types/config";
import headerComponent from "./components/header.component";
import footerComponent from "./components/footer.component";
import layoutComponent from "./components/layout.component";
import colorBase from "./base/color.base";
import layoutUtility from "./utilities/layout.utility";
import productComponent from "./components/product.component";
import cartComponent from "./components/cart.component";
import cgvComponent from "./components/cgv.component";

const preset: Config = {
  content: [],
  presets: [mosiUI],
  plugins: [
    plugin(function ({
      addBase,
      addComponents,
      addUtilities,
      theme,
    }: PluginAPI) {
      addBase({
        ...colorBase(theme),
      });

      addComponents({
        ...headerComponent(theme),
        ...footerComponent(theme),
        ...layoutComponent(theme),
        ...productComponent(theme),
        ...cartComponent(theme),
        ...cgvComponent(),
      });

      addUtilities({
        ...layoutUtility(),
      });
    }),
  ],
};

export default preset;
