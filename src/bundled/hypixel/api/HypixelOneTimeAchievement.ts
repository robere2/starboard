import {HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelParseError} from "./HypixelParseError.ts";

export class HypixelOneTimeAchievement {
    public points: number;
    public name: string;
    public description: string;
    public gamePercentUnlocked?: number;
    public globalPercentUnlocked?: number;
    public legacy?: boolean;
    public secret?: boolean;
    [undocumentedProperties: string]: any;

    constructor(input: HypixelAPIValue<HypixelOneTimeAchievement>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.points == null) {
            throw new HypixelParseError("Points cannot be null", input)
        }
        this.points = input.points;
        if(input.name == null) {
            throw new HypixelParseError("Name cannot be null", input)
        }
        this.name = input.name;
        if(input.description == null) {
            throw new HypixelParseError("Description cannot be null", input)
        }
        this.description = input.description;
    }
}
