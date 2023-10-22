import type {HypixelAPI} from "../HypixelAPI";
import * as z from "zod";
import {
    ZodEnumHypixelGames,
    ZodEnumHypixelPetConsumables, ZodEnumMinecraftFireworkShapes,
    ZodEnumMinecraftFormatting
} from "./enums";
import {networkExpToLevel, UUID_REGEX} from "../util";
import {HypixelEntity} from "../HypixelEntity";
import {BaseSchema} from "../BaseAPI";
import {ZodUnixDate} from "./ZodUnixDate";
import type {HypixelGuild} from "./GuildSchema";
import {HypixelRecentGame} from "./RecentGamesSchema";
import {HypixelSession} from "./StatusSchema";

export type PlayerSchema = ReturnType<typeof generatePlayerSchema>;
export type HypixelPlayer = HypixelEntity & z.infer<PlayerSchema>["player"];
export function generatePlayerSchema(api: HypixelAPI) {

    const urlTransformer = (v: string | undefined | null) => {
        if(!v) {
            return v;
        }
        if(!v.startsWith("http") && !v.startsWith("//")) {
            v = "https://" + v
        }
        return new URL(v);
    }

    return BaseSchema.extend({
        player: z.object({
            _id: z.string(),
            uuid: z.string().regex(UUID_REGEX),
            achievements: z.record(z.string(), z.number().nonnegative()).default({}).readonly(), // TODO add getter
            // For some reason, some players can have empty arrays here. We filter them out. Example: a621a7a7-9f32-4b5c-8344-9e4453ad454d
            achievementsOneTime: z.array(z.any())
                .transform(arr =>arr.filter((v) => !Array.isArray(v) || v.length > 0))
                .pipe(
                    z.array(z.string()).default([]).readonly()
                ), // TODO add getter
            auto_spawn_pet: z.boolean().nullish(),
            channel: z.string().nullish(), // TODO improve specificity
            chat: z.boolean().nullish(),
            disguise: z.string().nullish(), // TODO improve specificity
            displayname: z.string().nullish(),
            eulaCoins: z.boolean().nullish(),
            fireworkStorage: z.array(
                z.object({
                    flight_duration: z.number().nullish(),
                    shape: ZodEnumMinecraftFireworkShapes.nullish(),
                    trail: z.boolean().nullish(),
                    twinkle: z.boolean().nullish(),
                    colors: z.string().regex(/(\d{1,3},\d{1,3},\d{1,3})?(?::\d{1,3},\d{1,3},\d{1,3})*/).nullish(),
                    fade_colors: z.string().regex(/(\d{1,3},\d{1,3},\d{1,3})?(?::\d{1,3},\d{1,3},\d{1,3})*/).nullish(),
                    selected: z.boolean().nullish()
                }).readonly()
            ).nullish().readonly(),
            firstLogin: ZodUnixDate.nullish().readonly(),
            gadget: z.string().nullish(), // TODO improve specificity
            guildNotifications: z.boolean().nullish(),
            karma: z.number().nonnegative().nullish(),
            lastLogin: ZodUnixDate.nullish().readonly(),
            legacyGolem: z.boolean().nullish(),
            mostRecentMinecraftVersion: z.number().nullish(),
            mostRecentlyThanked: z.string().nullish(),
            mostRecentlyThankedUuid: z.string().regex(UUID_REGEX).nullish(), // TODO add getter
            mostRecentlyTipped: z.string().nullish(),
            mostRecentlyTippedUuid: z.string().regex(UUID_REGEX).nullish(), // TODO add getter
            networkExp: z.number().nonnegative().nullish(), // TODO add level getter
            notifications: z.boolean().nullish(),
            packageRank: z.string().nullish(), // TODO add formatting getter
            parkourCompletions: z.record(z.string(),
                z.array(
                    z.object({
                        timeStart: ZodUnixDate.readonly(),
                        timeTook: z.number().nonnegative()
                    }).readonly()
                )).nullish().readonly(),
            playername: z.string().nullish(),
            quests: z.record(z.string(), z.object({
                completions:
                    z.array(
                        z.object({
                            time: ZodUnixDate.nullish().readonly()
                        }).readonly())
                    .default([]).readonly(),
                active: z.object({
                    started: ZodUnixDate.nullish().readonly(),
                    objectives: z.record(z.string(), z.union([z.number(), z.boolean()])).default({}).readonly()
                }).nullish().readonly()
            })).default({}).readonly(),
            rank: z.string().nullish(), // TODO add formatting getter
            seeRequests: z.boolean().nullish(),
            spectators_invisible: z.boolean().nullish(),
            stats: z.any(), // TODO implement
            testPass: z.boolean().nullish(),
            thanksReceived: z.number().nonnegative().nullish(),
            thanksSent: z.number().nonnegative().nullish(),
            timePlaying: z.number().nonnegative().nullish(), // TODO figure out format + add duration?
            tournamentTokens: z.number().nullish(),
            vanityMeta: z.object({
                packages: z.array(z.string()).default([]).readonly(),
            }).nullish().readonly(),
            wardrobe: z.string().nullish(),
            eugene: z.object({
                dailyTwoKExp: ZodUnixDate.nullish().readonly(),
                weekly_booster: ZodUnixDate.nullish().readonly()
            }).nullish().readonly(),
            voting: z.record(z.string(), z.number()).nullish().readonly(),
            adventureTester: z.boolean().nullish(),
            housingMeta: z.object({
                tutorialStep: z.string().nullish(),
                packages: z.array(z.string()).default([]).readonly(),
                allowedBlocks: z.array(z.string()).default([]).readonly(),
                visibilityDisabled: z.boolean().nullish(),
                toggle_BORDER: z.boolean().nullish(),
                toggle_TIPS: z.boolean().nullish(),
                playerSettings: z.object({
                    BORDER: z.string().nullish(),
                    VISIBILITY: z.string().nullish(),
                    TIPS: z.string().nullish(),
                    customVisibility: z.number().nullish()
                }).nullish().readonly(),
                playlist: z.string().nullish(),
                firstHouseJoinMs: ZodUnixDate.nullish().readonly(),
                selectedChannels_v3: z.array(z.string()).default([]).readonly(),
                plotSize: z.string().nullish()
                    // TODO given_cookies_#####: UUID[]
            }).nullish().readonly(),
            petConsumables: z.record(ZodEnumHypixelPetConsumables, z.number()).default({}).readonly(),
            petStats: z.record(z.string(), z.object({ // TODO improve specificity for pet ID key
                THIRST: z.object({
                    value: z.number().nullish(),
                    timestamp: ZodUnixDate.nullish().readonly()
                }).nullish().readonly(),
                HUNGER: z.object({
                    value: z.number().nullish(),
                    timestamp: ZodUnixDate.nullish().readonly()
                }).nullish().readonly(),
                EXERCISE: z.object({
                    value: z.number().nullish(),
                    timestamp: ZodUnixDate.nullish().readonly()
                }).nullish().readonly(),
                experience: z.number().nonnegative().nullish()
            }).nullish().readonly()).default({}).readonly(),
            petJourneyTimestamp: ZodUnixDate.nullish().readonly(),
            transformation: z.string().nullish(),
            socialMedia: z.object({
                links: z.object({
                    TWITTER: z.string().nullish().transform(urlTransformer),
                    YOUTUBE:  z.string().nullish().transform(urlTransformer),
                    INSTAGRAM: z.string().nullish().transform(urlTransformer),
                    TWITCH: z.string().nullish().transform(urlTransformer),
                    HYPIXEL: z.string().nullish().transform(urlTransformer),
                    DISCORD: z.string().nullish()
                }).nullish().readonly(),
                prompt: z.boolean().nullish(),
            }).nullish().readonly(),
            plotResets: z.object({
                time: ZodUnixDate.nullish().readonly(),
                uuid: z.string().regex(UUID_REGEX).nullish()
            }).nullish().readonly(),
            sendCerberusMessages: z.boolean().nullish(),
            rewardConsumed: z.boolean().nullish(),
            giftingMeta: z.object({
                giftsGiven: z.number().nonnegative().nullish(),
                bundlesGiven: z.number().nonnegative().nullish(),
                realBundlesGiven: z.number().nonnegative().nullish(),
                milestones: z.array(z.string()).default([]).readonly(), // TODO improve specificity
                realBundlesReceivedInc: z.number().nonnegative().nullish(),
                bundlesReceived: z.number().nonnegative().nullish(),
                ranksGiven: z.number().nonnegative().nullish(),
                rankgiftingmilestones: z.array(z.string()).default([]).readonly()
            }).nullish().readonly(),
            fortuneBuff: z.number().nullish(),
            rankPlusColor: ZodEnumMinecraftFormatting.nullish(),
            specialtyCooldowns: z.record(z.string(), z.boolean()).default({}).readonly(), // TODO improve specificity
            questSettings: z.object({
                autoActivate: z.boolean().nullish()
            }).nullish().readonly(),
            adsense_tokens: z.number().nullish(),
            lastAdsenseGenerateTime: ZodUnixDate.nullish().readonly(),
            lastClaimedReward: ZodUnixDate.nullish().readonly(),
            totalRewards: z.number().nullish(),
            totalDailyRewards: z.number().nullish(),
            rewardStreak: z.number().nonnegative().nullish(),
            rewardScore: z.number().nonnegative().nullish(),
            rewardHighScore: z.number().nonnegative().nullish(),
            vanityFirstConvertedBox: ZodUnixDate.nullish().readonly(),
            vanityConvertedBoxToday: z.number().nullish(),
            flashingSalePopup: ZodUnixDate.nullish().readonly(),
            flashingSalePoppedUp: z.number().nullish(),
            flashingSaleOpens: z.number().nullish(),
            flashingNewsPopup: z.array(z.coerce.number()).nullish().readonly(),
            flashingNewsPoppedUp: z.number().nullish(),
            flashingNewsOpens: z.number().nullish(),
            SANTA_QUEST_STARTED: z.boolean().nullish(),
            SANTA_FINISHED: z.boolean().nullish(),
            vanityFavorites: z.string().nullish(),
            network_update_book: z.string().nullish(),
            lastLogout: ZodUnixDate.nullish().readonly(),
            userLanguage: z.string().nullish(),
            autoDetectLanguage: z.boolean().nullish(),
            achievementTracking: z.array(z.string()).nullish().readonly(),
            achievementRewardsNew: z.record(z.string(), ZodUnixDate).default({}).readonly(),
            achievementTotem: z.object({
                canCustomize: z.boolean().nullish(),
                allowed_max_height: z.number().nonnegative().nullish(),
                unlockedParts: z.array(z.string()).default([]).readonly(), // TODO improve specificity
                selectedPart: z.record(z.custom<`slot_${number}`>((val) => {
                    return typeof val === "string" ? /slot_\d+/.test(val) : false;
                }), z.string()).default({}).readonly(), // TODO improve specificity
                unlockedColors: z.array(z.string()).default([]).readonly(), // TODO improve specificity
                selectedColors: z.record(z.custom<`slotcolor_${number}`>((val) => {
                    return typeof val === "string" ? /slotcolor_\d+/.test(val) : false;
                }), z.string()).default({}).readonly() // TODO improve specificity
            }).nullish().readonly(),
            achievementSync: z.object({
                quake_tiered: z.number().nullish()
            }).nullish().readonly(),
            challenges: z.record(z.string(), z.record(z.string(), z.number()).default({}).readonly()).default({}).readonly(),
            currentGadget: z.string().nullish(),
            achievementPoints: z.number().nullish(),
            tourney: z.union([z.object({
                first_join_lobby: ZodUnixDate.nullish().readonly(),
                total_tributes: z.number().nonnegative().nullish(),
            }).nullish().readonly(), z.record(z.string(), z.object({
                tributes_earned: z.number().nonnegative().nullish(),
                first_win: ZodUnixDate.nullish().readonly(),
                playtime: z.number().nonnegative().nullish(),
                claimed_ranking_reward: ZodUnixDate.nullish().readonly()
            }).nullish().readonly())]).nullish().readonly(),
            onetime_achievement_menu_sort_completion_sort: z.string().nullish(),
            battlePassGlowStatus: z.boolean().nullish(),
            newPackageRank: z.string().nullish(), // TODO improve specificity
            monthlyPackageRank: z.string().nullish(), // TODO improve specificity
            mostRecentMonthlyPackageRank: z.string().nullish(), // TODO improve specificity
            monthlyRankColor: ZodEnumMinecraftFormatting.nullish(),
            cooldowns: z.object({
                fun: z.record(z.string(), z.number()).default({}).readonly(),
            }).nullish().readonly(),
            monthlycrates: z.record(z.string(), z.object({
                REGULAR: z.boolean().nullish(),
                VIP: z.boolean().nullish(),
                VIP_PLUS: z.boolean().nullish(),
                MVP: z.boolean().nullish(),
                MVP_PLUS: z.boolean().nullish()
            })).default({}).readonly(),
            currentPet: z.string().nullish(), // TODO improve specificity
            currentClickEffect: z.string().nullish(),
            skyblock_free_cookie: ZodUnixDate.readonly().nullish(),
            seasonal: z.record(z.string(), z.any()).default({}).readonly(),
            parkourCheckpointBests: z.record(
                z.string(), z.record(
                    z.coerce.number(), z.number().nonnegative()
                ).default({}).readonly())
            .default({}).readonly(),
            mostRecentGameType: ZodEnumHypixelGames.nullish(),
            leveling: z.object({
                claimedRewards: z.array(z.number()).default([]).readonly(),
            })

        }).nullish().readonly().transform((player) => {
            return Object.assign(new HypixelEntity(api), {
                ...player,

                /**
                 *
                 */
                getLevel(this: HypixelEntity & typeof player): number {
                    return networkExpToLevel(this.networkExp ?? 0);
                },

                /**
                 *
                 */
                async getGuild(this: HypixelEntity & typeof player): Promise<HypixelGuild | null> {
                    if(!this.uuid) {
                        return null;
                    }
                    return api.getGuild(this.uuid)
                },

                /**
                 *
                 */
                async getRecentGames(this: HypixelEntity & typeof player): Promise<HypixelRecentGame[]> {
                    return api.getRecentGames(this.uuid)
                },

                /**
                 *
                 */
                async getSession(this: HypixelEntity & typeof player): Promise<HypixelSession | null> {
                    return api.getStatus(this.uuid);
                }

                // TODO getAchievements
                // TODO getOneTimeAchievements
                // TODO getSkyBlockProfiles
                // TODO getSkyBlockAuctions
                // TODO getSkyBlockBingoBoards
            })
        })
    })
}
