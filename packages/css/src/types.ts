import type { CustomThemeConfig } from "tailwindcss/types/config";

export type ThemeProps = <
  TDefaultValue =
    | Partial<
        CustomThemeConfig & {
          extend: Partial<CustomThemeConfig>;
        }
      >
    | undefined,
>(
  path?: string,
  defaultValue?: TDefaultValue
) => TDefaultValue;