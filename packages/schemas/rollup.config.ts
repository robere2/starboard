import {defineConfig} from "rollup";
import {dts} from "rollup-plugin-dts";

const externalDeps = [
    "@mcsb/api",
    "http",
    "path",
    "url-join"
];

export default defineConfig([
    {
        input: './dist/src/index.d.ts',
        output: {file: 'dist/index.d.ts', format: 'es'},
        external: externalDeps,
        plugins: [dts()]
    }
])
