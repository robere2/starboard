import chalk, {ChalkInstance} from "chalk";

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
