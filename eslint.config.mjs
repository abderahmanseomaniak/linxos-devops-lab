import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const BANNED_ELEMENTS = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "blockquote", "small", "code"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        ...BANNED_ELEMENTS.map((el) => ({
          selector: `JSXOpeningElement[name.name='${el}']`,
          message: `Use <Typography variant="..."> from '@/components/ui/typography' instead of <${el}>.`,
        })),
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
