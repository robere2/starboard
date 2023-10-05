import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelGameAchievements} from "./HypixelGameAchievements.ts";
import {HypixelChallenge} from "./HypixelChallenge.ts";
import {HypixelQuest} from "./HypixelQuest.ts";
import {HypixelResources} from "./HypixelResources.ts";
import {HypixelResource} from "./HypixelResource.ts";

// For some reason, these three games do not use their database name as a key in the achievements list. This is a
//   conversion table from database name to achievement category key.
const gamesToAchievements = new Map(Object.entries({
    "HungerGames": "blitz",
    "MCGO": "copsandcrims",
    "Battleground": "warlords"
}))

export class HypixelGame extends HypixelResource {
    public id: number;
    public name: string;
    public databaseName: string;
    public modeNames?: Record<string, string>;
    public retired?: boolean;
    public legacy?: boolean;

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelGame>) {
        super(parent, input);
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
}

export type HypixelGamesResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    games: Record<string, HypixelGame>;
}>
