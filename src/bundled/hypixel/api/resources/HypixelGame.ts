import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelGameAchievements} from "./HypixelGameAchievements.ts";
import {HypixelChallenge} from "./HypixelChallenge.ts";
import {HypixelQuest} from "./HypixelQuest.ts";
import {HypixelResources} from "./HypixelResources.ts";

// For some reason, these three games do not use their database name as a key in the achievements list. This is a
//   conversion table from database name to achievement category key.
const gamesToAchievements = new Map(Object.entries({
    "HungerGames": "blitz",
    "MCGO": "copsandcrims",
    "Battleground": "warlords"
}))

export class HypixelGame {

    private static parents: Map<string, HypixelResources> = new Map();

    private _parentId: string;
    public id: number;
    public name: string;
    public databaseName: string;
    public modeNames?: Record<string, string>;
    public retired?: boolean;
    public legacy?: boolean;
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelGame>, parent: HypixelResources) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.id == null) {
            throw new HypixelParseError("Game ID cannot be null", input)
        }
        if(input.name == null) {
            throw new HypixelParseError("Game name cannot be null", input)
        }
        if(input.databaseName == null) {
            throw new HypixelParseError("Game database name cannot be null", input)
        }
        this.id = input.id;
        this.name = input.name;
        this.databaseName = input.databaseName;
        this._parentId = parent.id;
        HypixelGame.parents.set(parent.id, parent);
    }

    public getParentResources(): HypixelResources {
        const parent = HypixelGame.parents.get(this._parentId);
        if(!parent) {
            throw new Error("Parent resources not found");
        }
        return parent;
    }

    public getAchievements(): HypixelGameAchievements | null {
        let achievements = this.getParentResources().achievements[this.databaseName.toLowerCase()];
        if(!achievements) {
            const convertedKey = gamesToAchievements.get(this.databaseName);
            if(!convertedKey) {
                return null; // No achievements for this game. This should mostly happen when the user is requesting
                //   achievements for a game which legitimately has no achievements, but could theoretically happen
                //   if Hypixel adds new games in the future but mismatches the database name and achievements key.
            }
            achievements = this.getParentResources().achievements[convertedKey];
        }
        return achievements;
    }

    public getChallenges(): HypixelChallenge[] {
        return this.getParentResources().challenges[this.databaseName.toLowerCase()]
    }

    public getQuests(): HypixelQuest[] {
        return this.getParentResources().quests[this.databaseName.toLowerCase()]
    }

    public toJSON() {
        const result: Record<string, unknown> = {};
        for(const key in this) {
            if(key === "_parentId") {
                continue;
            }
            result[key] = this[key];

        }
        return result;
    }
}

export type HypixelGamesResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    games: Record<string, HypixelGame>;
}>
