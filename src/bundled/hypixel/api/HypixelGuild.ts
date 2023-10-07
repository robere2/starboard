import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelParseError} from "./HypixelParseError.ts";
import {HypixelEntity} from "./HypixelEntity.ts";
import {HypixelPlayer} from "./HypixelPlayer.ts";
import {HypixelResources} from "./resources";

export class HypixelGuildMember extends HypixelEntity {
    private readonly _parentId: string;
    public readonly uuid: string;
    public readonly rank?: string;
    public readonly questParticipating?: number;
    public readonly expHistory?: Record<string, number>;
    public readonly mutedTill?: number;
    [undocumentedProperties: string]: any;

    constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelGuildMember>, parentGuildId: string) {
        super(root, resources);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(!input.uuid) {
            throw new HypixelParseError("Guild member UUID is required", input)
        }
        this.uuid = input.uuid;
        this._parentId = parentGuildId;
    }

    public async getPlayer(): Promise<HypixelPlayer | null> {
        return this.getRoot().getPlayer(this.uuid);
    }

    public async getRank(): Promise<HypixelGuildRank | null> {
        const parent = await this.getRoot().getGuild(this._parentId);
        return parent?.ranks?.find(rank => rank.name === this.rank) ?? null;
    }

    public toJSON(): Record<string, unknown> {
        const superJSON = super.toJSON();
        const result: Record<string, unknown> = {};
        for(const key in superJSON) {
            if (key === "_parentId") {
                continue;
            }
            result[key] = superJSON[key];
        }
        return result;
    }
}

export class HypixelGuildRank extends HypixelEntity {
    private readonly _parentId: string;
    name: string;
    default?: boolean;
    tag?: string | null;
    created?: number;
    priority?: number;

    constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelGuildRank>, parentGuildId: string) {
        super(root, resources);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(!input.name) {
            throw new HypixelParseError("Guild rank name is required", input)
        }
        this.name = input.name;
        this._parentId = parentGuildId;
    }

    public async getMembers(): Promise<HypixelGuildMember[] | null> {
        const parent = await this.getRoot().getGuild(this._parentId);
        return parent?.members?.filter(member => member.rank === this.name) ?? null;
    }

    public toJSON(): Record<string, unknown> {
        const superJSON = super.toJSON();
        const result: Record<string, unknown> = {};
        for(const key in superJSON) {
            if (key === "_parentId") {
                continue;
            }
            result[key] = superJSON[key];
        }
        return result;
    }
}

export class HypixelGuild extends HypixelEntity {
    _id: string; // Not documented, but pretty safe to assume this will always be present.
    coins?: number;
    coinsEver?: number;
    created?: number;
    members?: HypixelGuildMember[];
    name?: string;
    joinable?: boolean;
    legacyRanking?: number;
    exp?: number;
    description?: string;
    ranks?: HypixelGuildRank[];
    publiclyListed?: boolean;
    achievements?: Record<string, number>;
    chatMute?: number;
    banner?: Record<string, any>; // TODO
    name_lower?: string;
    tag?: string;
    guildExpByGameType?: Record<string, number>;
    [undocumentedProperties: string]: any

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelGuild>) {
        super(root, resources);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(!input._id) {
            throw new HypixelParseError("Guild ID is required", input)
        }
        this._id = input._id;

        if(input.members) {
            const members: HypixelGuildMember[] = [];
            for(const member of input.members) {
                if(!member) {
                    throw new HypixelParseError("Guild member cannot be null", input)
                }
                members.push(new HypixelGuildMember(root, resources, member, this._id));
            }
            this.members = members;
        }

        if(input.ranks) {
            const ranks: HypixelGuildRank[] = [];
            for(const rank of input.ranks) {
                if(!rank) {
                    throw new HypixelParseError("Guild rank cannot be null", input)
                }
                ranks.push(new HypixelGuildRank(root, resources, rank, this._id));
            }
            this.ranks = ranks;
        }
    }
}

export type HypixelGuildResponse = HypixelAPIResponse<{ guild: HypixelGuild | null }>
