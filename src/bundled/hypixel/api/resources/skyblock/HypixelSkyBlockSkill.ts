import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../../HypixelAPI.ts";
import {HypixelParseError} from "../../HypixelParseError.ts";
import {HypixelEntity} from "../../HypixelEntity.ts";
import {HypixelResources} from "../HypixelResources.ts";
import {HypixelSkyBlockCollection} from "./HypixelSkyBlockCollection.ts";

export class HypixelSkyBlockSkillLevel extends HypixelEntity {
    public level: number;
    public totalExpRequired: number;
    public unlocks: string[];

    constructor(root: HypixelAPI, parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockSkillLevel>) {
        super(root, parent);
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

export class HypixelSkyBlockSkill extends HypixelEntity {
    public name: string;
    public description: string;
    public maxLevel: number;
    public levels: HypixelSkyBlockSkillLevel[];

    public constructor(root: HypixelAPI, parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockSkill>) {
        super(root, parent);
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
            this.levels.push(new HypixelSkyBlockSkillLevel(root, parent, level));
        }
    }

    public getCollection(): HypixelSkyBlockCollection {
        return this.getResources().skyBlockCollections[this.name.toUpperCase()]
    }
}

export type HypixelSkyBlockSkillsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    version: string;
    skills: Record<string, HypixelSkyBlockSkill>;
}>
