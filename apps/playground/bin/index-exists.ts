import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {existsSync} from "fs";

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));
if(existsSync(join(__dirname, "..", "index.ts"))) {
    process.exit(0);
} else {
    process.exit(1);
}
