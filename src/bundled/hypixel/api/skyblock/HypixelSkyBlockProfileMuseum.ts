import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources, HypixelSkyBlockItem} from "../resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelSkyBlockInventoryData} from "./HypixelSkyBlockProfileMember.ts";

export class HypixelSkyBlockMuseumDonation extends HypixelEntity {
    private readonly _itemId: string;
    public readonly donated_time?: number;
    public readonly items?: HypixelSkyBlockInventoryData
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, id: string, input: HypixelAPIValue<HypixelSkyBlockMuseumDonation>) {
        super(root, resources);
        Object.assign(this, input);
        this._itemId = id;
    }

    public get itemId(): string {
        return this._itemId;
    }

    public getItem(): HypixelSkyBlockItem | null {
        return this.getResources().skyBlockItems.find(item => item.id === this.itemId) ?? null;
    }

    public toJSON(): Record<string, unknown> {
        const result: Record<string, unknown> = {};
        for(const key in this) {
            if(key === "_itemId") {
                continue;
            }
            result[key] = this[key];
        }
        return result;
    }
}

export class HypixelSkyBlockProfileMuseum extends HypixelEntity {
    public readonly value?: number;
    public readonly appraisal?: boolean;
    public readonly items: Record<string, HypixelSkyBlockMuseumDonation> = {};
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockProfileMuseum>) {
        super(root, resources);
        Object.assign(this, input);

        for(const key in input.items) {
            if(!input.items[key]) {
                continue;
            }
            this.items[key] = new HypixelSkyBlockMuseumDonation(root, resources, key, input.items[key] as HypixelSkyBlockMuseumDonation);
        }
    }
}

export type HypixelSkyBlockMuseumResponse = HypixelAPIResponse<{
    members: Record<string, HypixelSkyBlockProfileMuseum>;
}>;
