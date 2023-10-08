import {HypixelEntity} from "./HypixelEntity.ts";
import {HypixelResources} from "./resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";

export class HypixelGamePlayerCount extends HypixelEntity {
    public readonly players: number;
    public readonly modes: Record<string, number> = {};
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelGamePlayerCount>) {
        super(root, resources);
        Object.assign(this, input);
        this.players = input.players ?? 0;
        this.modes = {};
        for (const mode in input.modes) {
            if(input.modes[mode] == null) {
                continue;
            }
            this.modes[mode] = input.modes[mode] ?? 0;
        }
    }
}

export class HypixelPlayerCount extends HypixelEntity {
    public readonly games: Record<string, HypixelGamePlayerCount>;
    public readonly playerCount: number;
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelPlayerCount>) {
        super(root, resources);
        Object.assign(this, input);

        this.playerCount = input.playerCount ?? 0;
        this.games = {};
        for (const game in input.games) {
            if(!input.games[game]) {
                continue;
            }
            this.games[game] = new HypixelGamePlayerCount(root, resources, input.games[game] as HypixelGamePlayerCount);
        }
    }
}
export type HypixelCountsResponse = HypixelAPIResponse<HypixelPlayerCount>;
