import {defineConfig} from "rollup";
import typescript from "@rollup/plugin-typescript";
import {dts} from "rollup-plugin-dts";

const externalDeps = [
    "@manypkg/get-packages",
    "chalk",
    "chokidar",
    "child_process",
    "path",
    "pidtree",
    "find-process",
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
        plugins: [typescript()]
    },
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.js",
            sourcemap: true,
            format: "es"
        },
        external: externalDeps,
        plugins: [typescript()]
    },
    {
        input: "src/bin.ts",
        output: {
            file: "dist/bin.js",
            sourcemap: true,
            format: "es"
        },
        external: externalDeps,
        plugins: [typescript()]
    },
    {
        input: './dist/src/index.d.ts',
        output: {file: 'dist/index.d.ts', format: 'es'},
        external: externalDeps,
        plugins: [dts()]
    }
])
