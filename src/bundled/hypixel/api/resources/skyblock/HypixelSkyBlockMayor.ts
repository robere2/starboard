import {HypixelAPIValue} from "../../HypixelAPI.ts";
import {HypixelParseError} from "../../HypixelParseError.ts";
import {HypixelSkyBlockElection} from "./HypixelSkyBlockElection.ts";

export class HypixelSkyBlockMayorPerk {
    name: string;
    description: string;
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelSkyBlockMayorPerk>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.name == null) {
            throw new HypixelParseError("Mayor perk name cannot be null", input)
        }
        this.name = input.name;
        if(input.description == null) {
            throw new HypixelParseError("Mayor perk description cannot be null", input)
        }
        this.description = input.description;
    }
}

export class HypixelSkyBlockMayor {
    public key: string;
    public name: string;
    public perks: HypixelSkyBlockMayorPerk[];
    public election?: HypixelSkyBlockElection;
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelSkyBlockMayor>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.key == null) {
            throw new HypixelParseError("Mayor key cannot be null", input)
        }
        this.key = input.key;

        if(input.name == null) {
            throw new HypixelParseError("Mayor name cannot be null", input)
        }
        this.name = input.name;

        this.perks = [];
        for(const perk of input.perks ?? []) {
            if(!perk) {
                continue;
            }
            this.perks.push(new HypixelSkyBlockMayorPerk(perk));
        }

        this.election = input.election ? new HypixelSkyBlockElection(input.election) : undefined;
    }
}
