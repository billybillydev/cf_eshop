module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/typescript",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "@typescript-eslint", "import"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "import/order": [
      "warn",
      {
        groups: [["builtin", "external", "internal"]],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        alphabetize: {
          order: "asc" /* "asc" | "desc" */,
          caseInsensitive: true,
        },
      },
    ],
    "import/newline-after-import": ["error", { count: 1 }],
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: [
          "./apps/react/tsconfig.json",
          "./packages/domain/tsconfig.json",
        ],
      },
    },
  },
};
