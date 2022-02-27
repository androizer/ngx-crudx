module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  env: {
    node: true,
  },
  ignorePatterns: [".eslintrc.js", "./apps/ngx-crudx-demo/karma.conf.js"],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
  },
};
