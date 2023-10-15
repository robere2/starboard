import type {HypixelAPI} from "./HypixelAPI.ts";

export class HypixelEntity {
    // A global API registry allows children entities to be able to use the parent API without creating a circular
    //   reference structure. Instead, they store the ID of the HypixelAPI. We store them here to avoid circular
    //   imports.
    private static apiRegistry: Map<string, HypixelAPI> = new Map();
    private readonly __starboardRootId__: string;

    public constructor(root: HypixelAPI) {
        this.__starboardRootId__ = root.id;
    }

    public getRoot(): HypixelAPI {
        return HypixelEntity.getRoot(this.__starboardRootId__);
    }

    public static getRoot(id: string): HypixelAPI {
        const root = HypixelEntity.apiRegistry.get(id);
        if(!root) {
            throw new Error(`No HypixelAPI found with ID ${id}`);
        }
        return root;
    }

    public static registerAPI(api: HypixelAPI) {
        HypixelEntity.apiRegistry.set(api.id, api);
    }

    public toJSON() {
        const result: Record<string, unknown> = {};
        for(const key in this) {
            if(key === "__starboardRootId__") {
                continue;
            }
            result[key] = this[key];

        }
        return result;
    }
}
