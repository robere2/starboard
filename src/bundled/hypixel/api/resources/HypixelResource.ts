import {HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelResource {

    private static parents: Map<string, HypixelResources> = new Map();

    private readonly _parentId: string;
    [undocumentedProperties: string]: any

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelResource>) {
        Object.assign(this, input); // Copy undocumented and non-required properties

        this._parentId = parent.id;
        HypixelResource.parents.set(parent.id, parent);
    }

    public getParentResources(): HypixelResources {
        const parent = HypixelResource.parents.get(this._parentId);
        if(!parent) {
            throw new Error("Parent resources not found");
        }
        return parent;
    }

    public toJSON() {
        const result: Record<string, unknown> = {};
        for(const key in this) {
            if(key === "_parentId") {
                continue;
            }
            result[key] = this[key];

        }
        return result;
    }
}
