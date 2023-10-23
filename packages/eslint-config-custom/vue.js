const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * typescript packages.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-recommended"
    ],
    plugins: ['@typescript-eslint'],
    parser: 'vue-eslint-parser',
    parserOptions: {
        project,
        parser: '@typescript-eslint/parser',
        tsconfigRootDir: process.cwd(),
        extraFileExtensions: ['.vue'],
    },
    globals: {
        React: true,
        JSX: true,
    },
    settings: {
        "import/resolver": {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: ["node_modules/", "dist/"],
    rules: {
        "@typescript-eslint/no-explicit-any": "off"
    }
};
