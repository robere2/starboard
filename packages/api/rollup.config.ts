import {defineConfig} from "rollup";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import {dts} from "rollup-plugin-dts";

const externalDeps = [
    "crypto",
    "zod",
    "url"
];

export default defineConfig([
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.cjs",
            sourcemap: true,
            format: "cjs"
        },
        external: externalDeps,
        plugins: [typescript(), json()]
    },
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.js",
            sourcemap: true,
            format: "es"
        },
        external: externalDeps,
        plugins: [typescript(), json()]
    },
    {
        input: './dist/src/index.d.ts',
        output: {file: 'dist/index.d.ts', format: 'es'},
        external: externalDeps,
        plugins: [dts()]
    }
])
