module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
      "next/core-web-vitals",
      "plugin:@typescript-eslint/recommended"
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  };
  