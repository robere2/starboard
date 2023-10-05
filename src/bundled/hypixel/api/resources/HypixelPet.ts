import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelRarity} from "./HypixelRarity.ts";
import {HypixelResource} from "./HypixelResource.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelPet extends HypixelResource {
    public key: string;
    public name: string;
    public rarity?: string;
    public package?: string;

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelPet>) {
        super(parent, input);
        if(input.key == null) {
            throw new HypixelParseError("Pet key cannot be null", input)
        }
        if(input.name == null) {
            throw new HypixelParseError("Pet name cannot be null", input)
        }
        this.key = input.key;
        this.name = input.name;
        this.rarity = input.rarity;
        this.package = input.package;
    }
}

export type HypixelPetsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    types: HypixelPet[];
    rarities: HypixelRarity[];
}>
