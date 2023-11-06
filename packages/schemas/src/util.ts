import chalk, {ChalkInstance} from "chalk";
import {compile} from "json-schema-to-typescript";
import fs from "fs";
import {dirname, join} from "path";
import {fileURLToPath} from "url";

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * While JSON schemas do not need to obey any specific order, when we write them to the file system, we want to make
 * as small of a diff as possible. Additionally, similar properties may be discovered by the generator at vastly
 * different times, which would normally place them potentially thousands of lines apart within the schema.
 *
 * To avoid both of these issues, we sort all of our schema's objects by key, and primitive arrays by value. Arrays of
 * objects are not touched.
 * @param input The schema to sort
 * @returns A sorted schema
 * @throws
 * - Stack overflow on very deep object inputs (this method is recursive).
 */
export function sortObject<T>(input: T): T {
    if(typeof input !== "object" || input === null) {
        return input;
    } else if(Array.isArray(input)) {
        return input.sort().map(v => {
            return sortObject(v);
        }) as T;
    } else {
        const inputObj: Record<string, any> = input;
        const newObj: T = {} as any;
        for(const key of Object.keys(input).sort()) {
            newObj[key as keyof T] = sortObject(inputObj[key])
        }
        return newObj;
    }
}

/**
 * Pick random values out of an array.
 * @param arr Array to pick items out of.
 * @param amount The number of items to pick. If less than or equal to 0, no items will be picked.
 * If greater than or equal to the length of the array, all items will be picked, but in a random order.
 * @returns An array with all of the randomly picked items.
 */
export function pickRandom<T>(arr: T[], amount: number): T[] {
    const output: T[] = [];
    const arrCopy = [...arr]
    amount = Math.min(amount, arr.length)
    for(let i = 0; i < amount; i++) {
        const randomIndex = Math.floor(Math.random() * arrCopy.length);
        output.push(arrCopy.splice(randomIndex, 1)[0])
        logger(chalk.dim("Picked random value: " + output[output.length - 1]), true);
    }
    return output;
}
/**
 * Create a string of the passed lines encapsulated in a box. The box is automatically sized to fit the longest line,
 * and the text is centered on all shorter lines. Each line is its own string within the returned array.
 *
 * @example
 * console.log(textBox(["You won!", "Congratulations, you did it!"]).join('\n'))
 * // --------------------------------
 * // |           You won!           |
 * // | Congratulations, you did it! |
 * // --------------------------------
 * @param lines Lines to print within the box
 * @param boxColor A Chalk instance that is used to color the box outline
 * @param textColor A Chalk instance that is used to color the text within the box
 * @returns An array of strings containing the text box, where each string is one line of the box. No new lines or
 * characters before the first `-`, or after the last `-`.
 */
export function textBox(lines: string[], boxColor?: ChalkInstance, textColor?: ChalkInstance): string[] {
    const boxSideMargins = 1;
    let boxWidth = boxSideMargins * 2;
    for(const line of lines) {
        const lineWidth = line.length + boxSideMargins * 2;
        if(lineWidth > boxWidth) {
            boxWidth = lineWidth;
        }
    }


    let topLines = '-'.repeat(boxWidth + 2)
    let sideLines = '|';
    if(boxColor) {
        topLines = boxColor(topLines);
        sideLines = boxColor(sideLines);
    }
    const output: string[] = [];
    output.push(topLines)
    for(const line of lines) {
        const spacesToCenter = (boxWidth - line.length) / 2;
        const coloredLine = textColor ? textColor(line) : line;
        output.push(sideLines + ' '.repeat(Math.floor(spacesToCenter)) + coloredLine + ' '.repeat(Math.ceil(spacesToCenter)) + sideLines);
    }
    output.push(topLines)

    return output;
}

/**
 * Write text to stdout, overwriting the current line(s). Multiple lines can be printed by passing an array, and they
 * will all be overwritten by the next call to `log`, unless you append a `\n` to the last string.
 * the string.
 * @param text Text to print to stdout.
 * @param debug Whether to only print this text if debug mode is enabled.
 */
export function logger(text: string | string[], debug = false) {
    if(!debug || process.env.MCSB_DEBUG === "true") {
        if(!Array.isArray(text)) {
            text = [text];
        }
        for(let i = 0; i < text.length; i++) {
            console.log(text[i]);
        }
    }
}

/**
 * Create TypeScript type definition files based on a JSON schema.
 * @param schema The JSON schema to create type definitions for.
 * @param name Output file name, without the extension (`.d.ts` will be appended).
 * @param outdir Directory to write TypeScript definitions file to.
 * @returns A `Promise` that resolves when the TypeScript definition file has been written.
 * @throws
 * - `Error` on file system error
 * - `Error` if `schema` is not a valid JSON schema
 */
export async function writeSchemaTypedefs(schema: Record<string, any>, name: string, outdir: string) {
    // compile schema to TypeScript
    const ts = await compile(schema, name, {
        additionalProperties: true
    })

    // Write compiled TypeScript to .d.ts files
    await fs.promises.mkdir(outdir, { recursive: true });
    await fs.promises.writeFile(join(outdir, `${name}.d.ts`), ts)
}

/**
 * Copy static files that should be compiled with the distributed package, such as the schema `.json` files, README,
 * LICENSE, and package.json.
 * @returns A `Promise` that resolves when all files have been copied.
 * @throws
 * - `Error` on file I/O error
 */
export async function copyExtraFiles() {
    // Tiny wrapper around fs.cp for logging the file we're copying
    async function copy(from: string, to: string) {
        logger(chalk.cyan("Copying", from, "to", to));
        await fs.promises.cp(from, to, {
            recursive: true
        });
    }
    await copy(join(__dirname, "schemas"), join(__dirname, "..", "dist", "schemas"))
    await copy(join(__dirname, "..", "..", "..", "LICENSE"), join(__dirname, "..", "dist", "LICENSE"))
}

/**
 * Create the `index.js` and `index.d.ts` files in the `dist` directory.
 * @returns A `Promise` that resolves when all files have been written.
 * @throws
 * - `Error` on file I/O error
 */
export async function createIndexFiles() {
    // Create a default index.js file with no contents
    await fs.promises.writeFile(join(__dirname, "..", "dist", "index.js"), "module.exports = {}")

    // Create a default index.d.ts file that contains all types concatenated
    const typeFiles = await fs.promises.readdir(join(__dirname, "..", "dist", "types"));
    logger(chalk.dim("Found type definition files: " + typeFiles.join(", ") + "\n"), true);
    let indexContents = "";
    for(const type of typeFiles) {
        indexContents += `export * from "./types/${type}"\n`
    }
    await fs.promises.writeFile(join(__dirname, "..", "dist", "index.d.ts"), indexContents);
}
