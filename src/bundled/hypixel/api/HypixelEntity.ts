import type {HypixelAPI} from "./HypixelAPI.ts";
import type {HypixelResources} from "./resources";

export class HypixelEntity {
    // A global API registry allows children entities to be able to use the parent API without creating a circular
    //   reference structure. Instead, they store the ID of the HypixelAPI. We store them here to avoid circular
    //   imports.
    private static apiRegistry: Map<string, HypixelAPI> = new Map();
    private static resourcesRegistry: Map<string, HypixelResources> = new Map();

    private readonly _rootId: string;
    private readonly _resourceId: string;
    [undocumentedProperties: string]: any

    public constructor(root: HypixelAPI, resources: HypixelResources) {
        this._rootId = root.id;
        this._resourceId = resources.id;
    }

    public getRoot(): HypixelAPI {
        return HypixelEntity.getRoot(this._rootId);
    }

    public static getRoot(id: string): HypixelAPI {
        const root = HypixelEntity.apiRegistry.get(id);
        if(!root) {
            throw new Error(`No HypixelAPI found with ID ${id}`);
        }
        return root;
    }

    public getResources(): HypixelResources {
        return HypixelEntity.getResources(this._resourceId);
    }


    public static getResources(id: string): HypixelResources {
        const resources = HypixelEntity.resourcesRegistry.get(id);
        if(!resources) {
            throw new Error(`No resources found with ID ${id}`);
        }
        return resources;
    }

    public static registerResources(resources: HypixelResources) {
        HypixelEntity.resourcesRegistry.set(resources.id, resources);
    }

    public static registerAPI(api: HypixelAPI) {
        HypixelEntity.apiRegistry.set(api.id, api);
    }

    public toJSON() {
        const result: Record<string, unknown> = {};
        for(const key in this) {
            if(key === "_rootId" || key === "_resourceId") {
                continue;
            }
            result[key] = this[key];

        }
        return result;
    }
}
