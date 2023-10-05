import {HypixelAPIResponse, HypixelAPIValue} from "../../HypixelAPI.ts";
import {HypixelParseError} from "../../HypixelParseError.ts";

export class HypixelSkyBlockSkillLevel {
    public level: number;
    public totalExpRequired: number;
    public unlocks: string[];

    constructor(input: HypixelAPIValue<HypixelSkyBlockSkillLevel>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
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

export class HypixelSkyBlockSkill {
    public name: string;
    public description: string;
    public maxLevel: number;
    public levels: HypixelSkyBlockSkillLevel[];
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelSkyBlockSkill>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
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
            this.levels.push(new HypixelSkyBlockSkillLevel(level));
        }
    }
}

export type HypixelSkyBlockSkillsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    version: string;
    collections: Record<string, HypixelSkyBlockSkill>;
}>
