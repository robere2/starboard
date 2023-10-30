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

function crawl(obj: any, cb: (identifier: Identifier, value: any) => void) {
    const valuesToCrawl: { value: any, namespace: Identifier}[] = [{
        value: obj,
        namespace: []
    }];
    while(valuesToCrawl.length > 0) {
        const next = valuesToCrawl.shift();
        const value = next!.value;
        const namespace = next!.namespace;
        cb(namespace, value)

        if(Array.isArray(value)) {
            for(let i = 0; i < value.length; i++) {
                valuesToCrawl.push({
                    value: value[i],
                    namespace: [...namespace, i]
                })
            }
        } else if(typeof value === "object" && value !== null) {
            for(const key in value) {
                valuesToCrawl.push({
                    value: value[key],
                    namespace: [...namespace, key]
                })
            }
        }
    }
}

type Identifier = (string | number | symbol)[];
function access(obj: any, identifier: Identifier): any {
    let currentValue = obj;
    for(let i = 0; i < identifier.length; i++) {
        const next = identifier[i];
        if(currentValue[next] === undefined) {
            return undefined;
        } else if(currentValue[next] === null) {
            return i === identifier.length - 1 ? null : undefined
        } else {
            currentValue = currentValue[next];
        }
    }
    return currentValue;
}

function findNewProperties(schema: any, input: Record<string, any>): Record<string, any> {
    const allValues = structuredClone(input)
    const definedValues = structuredClone(input)

    const validate = ajv.compile(schema);
    const validateAndRemove = ajvRemoveAdditional.compile(schema);

    validate(allValues);
    validateAndRemove(definedValues);

    const newProps: Record<string, any> = {};

    crawl(allValues, (identifier) => {
        const value = access(allValues, identifier);
        const definedValue = access(definedValues, identifier);

        if(value && (definedValue === null || definedValue === undefined)) {

        }
        console.log(value, definedValue)
    })

    return newProps;
}

