import {HypixelAPIValue} from "../../HypixelAPI.ts";
import {HypixelParseError} from "../../HypixelParseError.ts";
import {HypixelSkyBlockElection} from "./HypixelSkyBlockElection.ts";
import {HypixelResource} from "../HypixelResource.ts";
import {HypixelResources} from "../HypixelResources.ts";

export class HypixelSkyBlockMayorPerk extends HypixelResource {
    name: string;
    description: string;

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockMayorPerk>) {
        super(parent, input);
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

export class HypixelSkyBlockMayor extends HypixelResource {
    public key: string;
    public name: string;
    public perks: HypixelSkyBlockMayorPerk[];
    public election?: HypixelSkyBlockElection;

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockMayor>) {
        super(parent, input);
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
            this.perks.push(new HypixelSkyBlockMayorPerk(parent, perk));
        }

        this.election = input.election ? new HypixelSkyBlockElection(parent, input.election) : undefined;
    }
}
