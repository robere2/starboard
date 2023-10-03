import {UUID_REGEX} from "../../../util.ts";
import {HypixelAPIErrorDef} from "./HypixelAPI.ts";

export class HypixelPlayer {
    public readonly uuid: string;
    public readonly displayname: string | null = null;
    public readonly rank: string | null = null;
    public readonly packageRank: string | null = null;
    public readonly newPackageRank: string | null = null;
    public readonly monthlyPackageRank: string | null = null;
    public readonly firstLogin: number | null = null;
    public readonly lastLogin: number | null = null;
    public readonly lastLogout: number | null = null;
    public readonly stats: Record<string, any> | null = null;
    [undocumentedProperties: string]: any

    public constructor(data: HypixelPlayer);
    public constructor(uuid: string);
    public constructor(player: string | HypixelPlayer) {
        if(player instanceof HypixelPlayer) {
            this.uuid = player.uuid;
            this.displayname = player.displayname;
            this.rank = player.rank;
            this.packageRank = player.packageRank;
            this.newPackageRank = player.newPackageRank;
            this.monthlyPackageRank = player.monthlyPackageRank;
            this.firstLogin = player.firstLogin;
            this.lastLogin = player.lastLogin;
            this.lastLogout = player.lastLogout;
            this.stats = player.stats;
            Object.assign(this, player) // Copy all undocumented properties
        } else {
            if(!UUID_REGEX.test(player)) {
                throw new Error('Invalid UUID');
            }
            this.uuid = player;
        }
    }
}

export type HypixelPlayerResponse = {
    success: true;
    player: HypixelPlayer;
} | HypixelAPIErrorDef
