import {HypixelAPIResponse, HypixelAPIValue} from "../../HypixelAPI.ts";
import {HypixelParseError} from "../../HypixelParseError.ts";
import {HypixelResource} from "../HypixelResource.ts";
import {HypixelResources} from "../HypixelResources.ts";

export class HypixelSkyBlockSkillLevel extends HypixelResource {
    public level: number;
    public totalExpRequired: number;
    public unlocks: string[];

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockSkillLevel>) {
        super(parent, input);
        if(input.level == null) {
            throw new HypixelParseError("Skill level value cannot be null", input)
        }
        this.level = input.level;
        if(input.totalExpRequired == null) {
            throw new HypixelParseError("Skill level required EXP cannot be null", input)
        }
        this.totalExpRequired = input.totalExpRequired;

        this.unlocks = [];
        for(const unlock of input.unlocks ?? []) {
            if(!unlock) {
                continue;
            }
            this.unlocks.push(unlock);
        }
    }
}

export class HypixelSkyBlockSkill extends HypixelResource {
    public name: string;
    public description: string;
    public maxLevel: number;
    public levels: HypixelSkyBlockSkillLevel[];

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockSkill>) {
        super(parent, input);
        if(input.name == null) {
            throw new HypixelParseError("Skill name cannot be null", input)
        }
        this.name = input.name;

        if(input.description == null) {
            throw new HypixelParseError("Skill description cannot be null", input)
        }
        this.description = input.description;

        if(input.maxLevel == null) {
            throw new HypixelParseError("Skill max level cannot be null", input)
        }
        this.maxLevel = input.maxLevel;

        this.levels = [];
        for(const level of input.levels ?? []) {
            if (!level) {
                continue;
            }
            this.levels.push(new HypixelSkyBlockSkillLevel(parent, level));
        }
    }
}

export type HypixelSkyBlockSkillsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    version: string;
    collections: Record<string, HypixelSkyBlockSkill>;
}>
