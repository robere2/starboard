import {compile} from 'json-schema-to-typescript'
import * as fs from "fs";
import {dirname, join} from "path"
import {fileURLToPath} from "url"
import Ajv from "ajv";

const __dirname = dirname(fileURLToPath(import.meta.url))

// Read schema from file system
const schema = JSON.parse((await fs.promises.readFile(join(__dirname, '../schemas/hypixel/player.json'))).toString())

// compile schema to TypeScript
const ts = await compile(schema, 'HypixelPlayer', {
    additionalProperties: true
})

// Write compiled TypeScript to .d.ts files
const outdir = join(__dirname, "..", "..", "types")
await fs.promises.mkdir(outdir, { recursive: true });
await fs.promises.writeFile(join(outdir, 'HypixelPlayer.d.ts'), ts)

const ajv = new Ajv();
const ajvRemoveAdditional = new Ajv({removeAdditional: "all"})

const data = {
    "success": true,
    "player": {
        _id: "51e5ae2b0cf2a5a89b742a92",
        "achievements": {
            "arena_bossed": 77,
            "arena_climb_the_ranks": 1005,
            "arena_gladiator": 77,
            "arena_gotta_wear_em_all": 4
        }
    }
}

findNewProperties(schema, data);

function findNewProperties(schema: any, input: unknown): string[] {
    const unstrippedInput = structuredClone(input)
    const strippedInput = structuredClone(input)

    const validate = ajv.compile(schema);
    validate(unstrippedInput);

    const validateRemoveAdditional = ajvRemoveAdditional.compile(schema);
    validateRemoveAdditional(strippedInput);

    console.log(unstrippedInput);
    console.log(strippedInput);

    const newProps: string[][] = [];
    const stack: string[] = [];
    function recursiveNewValueSearch(key: string | null, knownValues: unknown, allValues: unknown) {
        if(knownValues === undefined && typeof allValues !== "undefined") {
            if(typeof allValues !== "object") {
                return;
            }
            for(const key in allValues) {
                stack.push(key);
                newProps.push([...stack]);
                recursiveNewValueSearch(key, undefined, (allValues as any)[key])
                stack.pop();
            }
            return;
        }

        if(typeof knownValues !== typeof allValues || Array.isArray(knownValues) !== Array.isArray(allValues)) {
            throw new Error("Known values is not a subset of all values");
        }

        if(typeof knownValues !== "object") {
            return;
        }
        if(Array.isArray(knownValues)) {
            for(let i = 0; i < knownValues.length; i++) {
                stack.push(i.toString());
                recursiveNewValueSearch(i.toString(), knownValues[i], (allValues as unknown[])[i])
                stack.pop()
            }
            return;
        }

        for(const key in allValues as object) {
            stack.push(key);
            if(Object.hasOwn(allValues as object, key) && !Object.hasOwn(knownValues as object, key)) {
                newProps.push([...stack]);
            }
            recursiveNewValueSearch(key, (knownValues as any)[key], (allValues as any)[key])
            stack.pop();
        }
    }

    recursiveNewValueSearch(null, strippedInput, unstrippedInput);
    console.log(JSON.stringify(newProps));

    //
    // if(typeof data !== "object") {
    //     return [];
    // }
    // const stack = [];
    // if(Array.isArray(data)) {
    //     for(const item of data) {
    //         const itemNewProps = findNewProperties(schema, item);
    //     }
    // }
}

