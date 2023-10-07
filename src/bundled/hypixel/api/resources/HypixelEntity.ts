import {HypixelAPI} from "../HypixelAPI.ts";

export class HypixelEntity {

    private static roots: Map<string, HypixelAPI> = new Map();

    private readonly _rootId: string;

    public constructor(root: HypixelAPI) {
        this._rootId = root.id;
        HypixelEntity.roots.set(root.id, root);
    }

    public getRoot(): HypixelAPI {
        const parent = HypixelEntity.roots.get(this._rootId);
        if(!parent) {
            throw new Error("Root API not found");
        }
        return parent;
    }

    public toJSON() {
        const result: Record<string, unknown> = {};
        for(const key in this) {
            if(key === "_rootId") {
                continue;
            }
            result[key] = this[key];

        }
        return result;
    }
}
