import {HypixelResources} from "./HypixelResources.ts";

export class HypixelResourceEntity {

    private static parents: Map<string, HypixelResources> = new Map();

    private readonly _parentId: string;
    [undocumentedProperties: string]: any

    public constructor(parent: HypixelResources) {
        this._parentId = parent.id;
        HypixelResourceEntity.parents.set(parent.id, parent);
    }

    public getResources(): HypixelResources {
        const parent = HypixelResourceEntity.parents.get(this._parentId);
        if(!parent) {
            throw new Error("Resources not found");
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
