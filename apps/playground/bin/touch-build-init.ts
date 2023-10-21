import * as fs from "fs";
import {dirname, join} from "path";
import {fileURLToPath} from "url";

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

if(!fs.existsSync(join(__dirname, "tmp"))) {
    fs.mkdirSync(join(__dirname, "tmp"));
}
fs.closeSync(fs.openSync(join(__dirname, "tmp", "build-init"), 'a'))
