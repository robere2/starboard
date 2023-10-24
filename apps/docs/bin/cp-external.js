#! /usr/bin/env node

import fs from 'fs/promises';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url))

async function copyOptionalFile(from, to) {
    from = join(__dirname, from)
    to = join(__dirname, to)
    let fileStat;
    try {
        fileStat = await fs.stat(from)
    } catch(err) {
        if(err.code === "ENOENT") {
            console.log(`File ${from} not found - skipped`)
        } else {
            throw err;
        }
    }

    if(fileStat?.isFile()) {
        await fs.copyFile(from, to);
        console.log(`Copying ${from} to ${to}`)
    }
}

(async () => {
    await copyOptionalFile("../../../LICENSE", "../src/LICENSE.md");
    await copyOptionalFile("../../../CODE_OF_CONDUCT.md", "../src/CODE_OF_CONDUCT.md");
    await copyOptionalFile("../../../CONTRIBUTING.md", "../src/CONTRIBUTING.md");
})()
