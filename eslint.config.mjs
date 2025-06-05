import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Enforce consistent code style
      "prefer-const": "error",
      "no-var": "error",
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      // React specific
      "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      // TypeScript specific
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
];

export default eslintConfig;
