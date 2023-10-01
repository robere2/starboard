import {UUID_REGEX} from "../../../util.ts";

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

    public constructor(uuid: string) {
        if(!UUID_REGEX.test(uuid)) {
            throw new Error('Invalid UUID');
        }
        this.uuid = uuid;
    }
}

export type HypixelPlayerResponse = {
    success: true;
    player: HypixelPlayer;
} | {
    success: false;
    cause: string;
}
