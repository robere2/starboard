import type {HypixelAPI} from "../HypixelAPI.ts";
import z from "zod";
import {ZodEnumHypixelGames, ZodEnumHypixelGuildAchievements, ZodEnumMinecraftFormatting} from "./enums.ts";
import {UUID_REGEX} from "../../../../util.ts";
import {HypixelEntity} from "../HypixelEntity.ts";
import {BaseSchema} from "../../../BaseAPI.ts";
import {ZodUnixDate} from "./ZodUnixDate.ts";
import {HypixelPlayer} from "./PlayerSchema.ts";

// EXP requirements from one level to the next (e.g., first element is amount of xp to get from level 0 to level 1).
const GUILD_LEVEL_REQS = [
    100_000,
    150_000,
    250_000,
    500_000,
    750_000,
    1_000_000,
    1_250_000,
    1_500_000,
    2_000_000,
    2_500_000,
    2_500_000,
    2_500_000,
    2_500_000,
    2_500_000,
    3_000_000
];
// Amount of XP required after which point the remaining levels are always the same distance apart.
const GUILD_MAX_EXP = GUILD_LEVEL_REQS.reduce((a, b) => a + b, 0);
// Cumulative amount of XP required for each level (i.e., the level XP plus all levels before it)
const GUILD_CUMULATIVE_EXP = GUILD_LEVEL_REQS.reduce((arr: number[], val) => {
    if(arr.length === 0) {
        return [val];
    } else {
        return [...arr, arr[arr.length - 1] + val]
    }
}, [])

export type GuildSchema = ReturnType<typeof generateGuildSchema>;
export type HypixelGuild = HypixelEntity & z.infer<GuildSchema>["guild"];
export function generateGuildSchema(api: HypixelAPI) {

    const bannerSchema = z.object({
        Base: z.coerce.number().min(0).max(16),
        Patterns: z.array(z.object({
            Pattern: z.string(),
            Color: z.string().regex(/^[0-9a-f]$/i)
        }).readonly()).default([]).readonly()
    })

    const rankSchema = z.object({
        name: z.string(),
        default: z.boolean().default(false),
        tag: z.string().nullish(),
        created: ZodUnixDate.nullish(),
        priority: z.number().nullish(),
    });

    const memberSchema = z.object({
        uuid: z.string().regex(UUID_REGEX),
        rank: z.string(),
        joined: ZodUnixDate.readonly(),
        mutedTill: ZodUnixDate.nullish().readonly(),
        questParticipation: z.number().nonnegative().nullish(),
        expHistory: z.record(z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/), z.number().nonnegative()).default({}).readonly(),
    });

    return BaseSchema.extend({
        guild: z.object({
            _id: z.string(),
            coins: z.number().nullish(),
            coinsEver: z.number().nullish(),
            created: ZodUnixDate.nullish().readonly(),
            members: z.array(memberSchema).nullish().default([]).readonly().transform((members) => {
                const transformedMembers: z.infer<typeof memberSchema>[] = [];
                for(const member of members ?? []) {
                    transformedMembers.push(Object.assign(new HypixelEntity(api), {
                        ...member,

                        /**
                         *
                         */
                        async getPlayer(this: HypixelEntity): Promise<HypixelPlayer | null> {
                            return this.getRoot().getPlayer(member.uuid);
                        }
                    }))
                }
                return transformedMembers;
            }),
            name: z.string().nullish(),
            joinable: z.boolean().nullish(),
            legacyRanking: z.number().nullish(),
            exp: z.number().nullish(),
            description: z.string().nullish(),
            ranks: z.array(rankSchema).nullish().default([]).readonly().transform((ranks) => {
                const transformedRanks: z.infer<typeof rankSchema>[] = [];
                for(const rank of ranks ?? []) {
                    transformedRanks.push(Object.assign(new HypixelEntity(api), {
                        ...rank,
                        // TODO - Not sure how to implement this. Need some way to refer to parent.
                        // getMembers(this: HypixelEntity & z.infer<HypixelAPIGuildModule["rankSchema"]>) {
                        //     const root = this.getRoot();
                        //     return root.getGuild("")?.members.filter(member => member.rank === this.name);
                        // }
                    }))
                }
                return transformedRanks;
            }),
            publiclyListed: z.boolean().nullish(),
            achievements: z.record(ZodEnumHypixelGuildAchievements, z.number()).default({}).readonly(),
            chatMute: z.number().nullish(),
            banner: bannerSchema.nullish().readonly(),
            name_lower: z.string().nullish(),
            tag: z.string().nullish(),
            tagColor: ZodEnumMinecraftFormatting.nullish(),
            preferredGames: z.array(ZodEnumHypixelGames).default([]).readonly(),
            guildExpByGameType: z.record(ZodEnumHypixelGames, z.number()).default({}).readonly()
        }).nullish().readonly().transform((guild) => {
            return Object.assign(new HypixelEntity(api), {
                ...guild,

                /**
                 *
                 */
                getLevel(): number {
                    if(!this.exp) {
                        return 0;
                    }
                    if(this.exp > GUILD_MAX_EXP) {
                        // All levels after this point are the same amount of XP apart. So we can just find how many
                        // levels go into that and add them to the number of non-linear levels.
                        const adjustedExp = this.exp - GUILD_MAX_EXP;
                        const linearLevels = Math.floor(adjustedExp / GUILD_LEVEL_REQS[GUILD_LEVEL_REQS.length - 1]);
                        return linearLevels + GUILD_LEVEL_REQS.length;
                    } else {
                        return GUILD_CUMULATIVE_EXP.findIndex(levelReq => (this.exp ?? 0) < levelReq);
                    }
                }
            })
        })
    })
}
