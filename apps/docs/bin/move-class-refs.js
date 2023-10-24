#! /usr/bin/env node

import fs from 'fs/promises';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import rimraf from "rimraf";

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * @param pkg {'api' | 'cli' | 'framework'}
 * @returns {Promise<Dirent[]>}
 */
async function getClassFiles(pkg) {
    const dir = join(__dirname, '..', 'src', pkg, 'reference', 'classes')
    if(!await fs.stat(dir).catch(() => {})) {
        return [];
    }
    return await fs.readdir(dir, {
        withFileTypes: true,
        recursive: true
    });
}
/**
 * @param pkg {'api' | 'cli' | 'framework'}
 * @returns {Promise<Dirent[]>}
 */
async function getNonClassFiles(pkg) {
    const dir = join(__dirname, '..', 'src', pkg, 'reference')
    if(!await fs.stat(dir).catch(() => {})) {
        return [];
    }
    return await fs.readdir(dir, {
        withFileTypes: true,
        recursive: true
    });
}

/**
 * @param pkg {'api' | 'cli' | 'framework'}
 * @returns {void}
 */
async function moveClassFiles(pkg) {
    // Remove classes/ from file paths
    const nonClassFiles = await getNonClassFiles(pkg);
    for(const file of nonClassFiles) {
        if(!file.isFile()) {
            continue;
        }
        const content = await fs.readFile(join(file.path, file.name), 'utf8');
        await fs.writeFile(join(file.path, file.name), content.replaceAll(/classes\//g, ''));
    }

    // Rewrite (../ in classes to just (, and move them to parent directory
    const classFiles = await getClassFiles(pkg);
    const dest = join(__dirname, '..', 'src', pkg, 'reference');
    for(const file of classFiles) {
        const content = await fs.readFile(join(file.path, file.name), 'utf8');
        await fs.writeFile(join(dest, file.name), content.replaceAll(/\(\.\.\//g, '('));
    }
    rimraf.sync(join(dest, 'classes'));
}

(async () => {
    await moveClassFiles("api");
    await moveClassFiles("framework");
    await moveClassFiles("cli");
})()
