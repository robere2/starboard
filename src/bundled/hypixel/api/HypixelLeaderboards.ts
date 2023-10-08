import {HypixelEntity} from "./HypixelEntity.ts";
import {HypixelResources} from "./resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelParseError} from "./HypixelParseError.ts";
import {HypixelPlayer} from "./HypixelPlayer.ts";

export class HypixelLeaderboardPath extends HypixelEntity {
    path: string;
    prefix?: string;
    title?: string;
    location?: string;
    count?: number;
    leaders?: string[];
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelLeaderboardPath>) {
        super(root, resources);
        Object.assign(this, input);
        if(!input.path) {
            throw new HypixelParseError("API response property \"path\" is required by HypixelLeaderboardPath", input)
        }
        this.path = input.path;
    }

    async *[Symbol.asyncIterator](): AsyncIterableIterator<HypixelPlayer | null> {
        for(const leader of this.leaders ?? []) {
            yield await this.getRoot().getPlayer(leader)
        }
    }
}

export class HypixelLeaderboards extends HypixelEntity {
    public readonly leaderboards: Record<string, HypixelLeaderboardPath[]> = {};

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<Record<string, HypixelLeaderboardPath[]>>) {
        super(root, resources);
        for(const game in input) {
            this.leaderboards[game] = [];
            for(const path of input[game] ?? []) {
                if(!path) {
                    continue;
                }
                this.leaderboards[game].push(new HypixelLeaderboardPath(root, resources, path));
            }
        }
    }
}

export type HypixelLeaderboardsResponse = HypixelAPIResponse<HypixelLeaderboards>;
