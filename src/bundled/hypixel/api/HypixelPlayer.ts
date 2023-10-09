import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelParseError} from "./HypixelParseError.ts";
import {HypixelEntity, HypixelQuest} from "./";
import {HypixelResources, HypixelTieredAchievement} from "./resources";
import {HypixelOneTimeAchievement} from "./resources";
import {HypixelPet} from "./resources";

export class HypixelPlayerFirework extends HypixelEntity {
    public readonly flight_duration: number;
    public readonly shape?: string;
    public readonly trail?: boolean;
    public readonly twinkle?: boolean;
    public readonly colors?: string;
    public readonly fade_colors?: string;
    public readonly selected?: boolean;
    [undocumentedProperties: string]: any;

    constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelPlayerFirework>) {
        super(root, resources);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.flight_duration == null) {
            throw new HypixelParseError("Player firework must have the \"flight_duration\" property", input);
        }
        this.flight_duration = input.flight_duration;
    }
}

export class HypixelPlayerQuestStatus extends HypixelEntity {
    public readonly completions?: {
        time?: number;
        [undocumentedProperties: string]: any;
    }[];
    private readonly _questKey;
    public readonly active?: {
        started?: number;
        objectives?: Record<string, number>
    }
    [undocumentedProperties: string]: any;

    constructor(root: HypixelAPI, resources: HypixelResources, key: string, input: HypixelAPIValue<HypixelPlayerQuestStatus>) {
        super(root, resources);
        this._questKey = key;
        Object.assign(this, input); // Copy undocumented and non-required properties
    }

    public get definition(): HypixelQuest | null {
        return this.getResources().flattenedQuests[this._questKey] ?? null;
    }

    public toJSON(): Record<string, unknown> {
        const result: Record<string, unknown> = {};
        for(const key in this) {
            if(key === "_questKey") {
                continue;
            }
            result[key] = this[key];
        }
        return result;
    }
}

export class HypixelPlayerPetStatistics extends HypixelEntity {
    _petTypeKey: string;
    name?: string;
    experience?: number;
    HUNGER?: {
        timestamp: number;
        value: number;
    }
    THIRST?: {
        timestamp: number;
        value: number;
    }
    EXERCISE?: {
        timestamp: number;
        value: number;
    }
    [undocumentedProperties: string]: any;

    constructor(root: HypixelAPI, resources: HypixelResources, key: string, input: HypixelAPIValue<HypixelPlayerPetStatistics>) {
        super(root, resources);
        Object.assign(this, input); // Copy undocumented and non-required properties
        this._petTypeKey = key;
    }

    public async getPetType(): Promise<HypixelPet | null> {
        const resources = await this.getRoot().getResources();
        return resources.pets.find(petType => petType.key === this._petTypeKey) ?? null;
    }

    public toJSON() {
        const result: Record<string, unknown> = {};
        for(const key in this) {
            if(key === "_petTypeKey") {
                continue;
            }
            result[key] = this[key];

        }
        return result;
    }
}

export class HypixelPlayer extends HypixelEntity {
    public readonly uuid: string;
    public readonly _id?: string;
    public readonly achievements?: Record<string, number>;
    public readonly achievementsOneTime?: string[];
    public readonly auto_spawn_pet?: boolean;
    public readonly channel?: string;
    public readonly chat?: boolean;
    public readonly disguise?: string;
    public readonly displayname?: string;
    public readonly eulaCoins?: boolean;
    public readonly fireworkStorage: HypixelPlayerFirework[];
    public readonly firstLogin?: number;
    public readonly gadget?: string;
    public readonly guildNotifications?: boolean;
    public readonly karma?: number;
    public readonly lastLogin?: number;
    public readonly legacyGolem?: boolean;
    public readonly mostRecentMinecraftVersion?: number;
    public readonly mostRecentlyThanked?: string;
    public readonly mostRecentlyThankedUuid?: string;
    public readonly mostRecentlyTipped?: string;
    public readonly mostRecentlyTippedUuid?: string;
    public readonly networkExp?: number;
    public readonly notifications?: boolean;
    public readonly packageRank?: string;
    public readonly parkourCompletions?: Record<string, {
        timeStart: number;
        timeTook: number;
        [undocumentedProperties: string]: any;
    }[]>;
    public readonly playername?: string;
    public readonly quests?: Record<string, HypixelPlayerQuestStatus>;
    public readonly rank?: string;
    public readonly seeRequests?: boolean;
    public readonly spectators_invisible?: boolean;
    public readonly stats: Record<string, any> = {};
    public readonly testPass?: boolean;
    public readonly thanksReceived?: number;
    public readonly thanksSent?: number;
    public readonly timePlaying?: number;
    public readonly tournamentTokens?: number;
    public readonly vanityMeta?: {
        packages?: string[]
        [undocumentedProperties: string]: any;
    }
    public readonly wardrobe?: string;
    public readonly eugene?: {
        dailyTwoKExp?: number;
        weekly_booster?: number;
        [undocumentedProperties: string]: any;
    }
    public readonly voting?: Record<string, number>
    public readonly adventureTester?: boolean;
    public readonly housingMeta?: {
        tutorialStep?: string;
        packages?: string[];
        allowedBlocks?: string[];
        visibilityDisabled?: boolean;
        toggle_BORDER?: boolean;
        toggle_TIPS?: boolean;
        playerSettings?: {
            BORDER: string;
            VISIBILITY: string;
            TIPS: string;
            customVisibility: number;
            [undocumentedProperties: string]: any;
        };
        playlist?: string;
        firstHouseJoinMs?: number;
        selectedChannels_v3?: string[];
        plotSize?: string;
        [undocumentedProperties: string]: any
    };
    public readonly petConsumables?: Record<string, number>;
    public readonly petStats: Record<string, HypixelPlayerPetStatistics>;
    public readonly petJourneyTimestamp?: number;
    public readonly transformation?: string;
    public readonly socialMedia?: {
        links?: {
            TWITTER?: string;
            HYPIXEL?: string;
            DISCORD?: string;
            TWITCH?: string;
            TIKTOK?: string;
            INSTAGRAM?: string;
            YOUTUBE?: string;
            [undocumentedProperties: string]: any;
        }
        prompt?: boolean;
        [undocumentedProperties: string]: any;
    }
    public readonly plotResets?: {
        time?: number;
        uuid?: string;
        [undocumentedProperties: string]: any;
    }
    public readonly sendCerberusMessages?: boolean;
    public readonly rewardConsumed?: boolean;
    public readonly giftingMeta?: {
        giftesGiven?: number;
        bundlesGiven?: number;
        realBundlesGiven?: number;
        milestones?: string[];
        realBundlesReceivedInc?: number;
        bundlesReceived?: number;
        realBundlesReceived?: number;
        ranksGiven?: number;
        rankgiftingmilestones?: string[];
        [undocumentedProperties: string]: any;
    };
    public readonly fortuneBuff?: number;
    public readonly rankPlusColor?: string;
    public readonly specialtyCooldowns: Record<`NORMAL${number}` | `VIP${number}` | `VIP_PLUS${number}` | `MVP${number}` | `MVP_PLUS${number}`, boolean> = {}
    public readonly questSettings?: {
        autoActivate?: boolean;
        [undocumentedProperties: string]: any;
    }
    public readonly adsense_tokens?: number;
    public readonly lastAdsenseGenerateTime?: number;
    public readonly lastClaimedReward?: number;
    public readonly totalRewards?: number;
    public readonly totalDailyRewards?: number;
    public readonly rewardStreak?: number;
    public readonly rewardScore?: number;
    public readonly rewardHighScore?: number;
    public readonly vanityFirstConvertedBox?: number;
    public readonly vanityConvertedBoxToday?: number;
    public readonly flashingSalePopup?: number;
    public readonly flashingSalePoppedUp?: number;
    public readonly flashingSaleOpens?: number;
    public readonly flashingNewsPopup?: string[];
    public readonly flashingNewsPoppedUp?: number;
    public readonly flashingNewsOpens?: number;
    public readonly SANTA_QUEST_STARTED?: boolean;
    public readonly SANTA_FINISHED?: boolean;
    public readonly vanityFavorites?: string;
    public readonly network_update_book?: string;
    public readonly lastLogout?: number;
    public readonly userLanguage?: string;
    public readonly autoDetectLanguage?: boolean;
    public readonly achievementTracking?: string[];
    public readonly achievementRewardsNew?: Record<`for_points_${number}00`, number>;
    public readonly achievementTotem?: {
        canCustomize?: boolean;
        allowed_max_height?: number;
        unlockedParts?: string[];
        selectedParts?: Record<`slot_${number}`, string>;
        unlockedColors?: string[];
        selectedColors?: Record<`slotcolor_${number}`, string>;
        [undocumentedProperties: string]: any;
    };
    public readonly achievementSync?: {
        quake_tiered?: number;
        [undocumentedProperties: string]: any;
    };
    public readonly challenges?: {
        all_time?: Record<string, number>;
        [key: `day_${number | string}`]: Record<string, number>;
        [undocumentedProperties: string]: any;
    }
    public readonly currentGadget?: string;
    public readonly achievementPoints?: number;
    public readonly tourney?: {
        first_join_lobby?: number;
        total_tributes?: number;
        hide_purchased?: boolean;
        shop_sort?: string;
        [tourneyKeysAndOtherProps: string]: {
            playtime?: number;
            tributes_earned?: number;
            first_win?: number;
            claimed_ranking_reward?: number;
            seenRPbook?: boolean;
            first_game?: number;
        } | any;
    };
    public readonly onetime_achievement_menu_sort_completion_sort?: string;
    public readonly battlePassGlowStatus?: boolean;
    public readonly newPackageRank?: string;
    public readonly monthlyPackageRank?: string;
    public readonly mostRecentMonthlyPackageRank?: string;
    public readonly monthlyRankColor?: string;
    public readonly cooldowns?: {
        fun: Record<string, number>;
        [undocumentedProperties: string]: any;
    };
    public readonly monthlycrates?: Record<string, {
        REGULAR?: boolean;
        VIP?: boolean;
        VIP_PLUS?: boolean;
        MVP?: boolean;
        MVP_PLUS?: boolean;
        [undocumentedProperties: string]: any;
    }>;
    public readonly currentPet?: string;
    public readonly currentClickEffect?: string;
    public readonly skyblock_free_cookie?: boolean;
    public readonly seasonal?: Record<string, any>;
    public readonly parkourCheckpointBests?: Record<string, Record<string, number>>
    public readonly mostRecentGameType?: string;
    public readonly leveling?: {
        claimedRewards?: number[];
        [undocumentedProperties: string]: any;
    }
    [undocumentedProperties: string]: any

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelPlayer>) {
        super(root, resources);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(!input.uuid) {
            throw new HypixelParseError("Player UUID cannot be null", input)
        }
        this.uuid = input.uuid;

        const fireworks: HypixelPlayerFirework[] = [];
        for(const firework of input.fireworkStorage ?? []) {
            if(!firework) {
                throw new HypixelParseError("Player firework cannot be null", input)
            }
            fireworks.push(new HypixelPlayerFirework(root, resources, firework));
        }
        this.fireworkStorage = fireworks;

        const pets: Record<string, HypixelPlayerPetStatistics> = {};
        for(const petKey in input.petStats ?? {}) {
            if(!petKey || !input.petStats?.[petKey]) {
                throw new HypixelParseError("Player pet stats cannot be null", input)
            }
            pets[petKey] = (new HypixelPlayerPetStatistics(root, resources, petKey, input.petStats[petKey] as HypixelPlayerPetStatistics));
        }
        this.petStats = pets;

        for(const quest in input.quests) {
            if(!quest || !input.quests[quest]) {
                throw new HypixelParseError("Player quest cannot be null", input)
            }
            (this.quests as Record<string, HypixelPlayerQuestStatus>)[quest] = new HypixelPlayerQuestStatus(root, resources, quest, input.quests[quest] as HypixelQuest);
        }
    }

    public getAchievements(): Record<string, HypixelTieredAchievement & {progress: number} | null> {
        if(!this.achievements) {
            return {};
        }
        const resources = this.getResources();
        const root = this.getRoot();
        const achievements = resources.achievements;

        const result: Record<string, HypixelTieredAchievement & {progress: number} | null> = {}
        for(const achievement in this.achievements) {
            const game = achievement.split("_", 1)[0].toLowerCase();
            const achievementName = achievement.substring(game.length + 1).toUpperCase();
            const achievementDef = achievements[game.toLowerCase()]?.tiered?.[achievementName];
            if(achievementDef) {
                result[achievement] = new HypixelTieredAchievement(root, resources, {
                    ...achievementDef,
                    progress: this.achievements[achievement]
                }) as HypixelTieredAchievement & {progress: number};
            } else {
                result[achievement] = null;
            }
        }
        return result;
    }

    public getOneTimeAchievements(): (HypixelOneTimeAchievement | null)[] {
        if(!this.achievementsOneTime) {
            return [];
        }

        const root = this.getRoot();
        const resources = this.getResources();
        const achievements = resources.achievements;

        const result: (HypixelOneTimeAchievement | null)[] = [];
        for(const achievement of this.achievementsOneTime) {
            const game = achievement.split("_", 1)[0].toLowerCase();
            const achievementName = achievement.substring(game.length + 1).toUpperCase();
            const achievementDef = achievements[game.toLowerCase()]?.one_time?.[achievementName];
            result.push(achievementDef ? new HypixelOneTimeAchievement(root, resources, achievementDef) : null);
        }
        return result;
    }
}

export type HypixelPlayerResponse = HypixelAPIResponse<{
    player: HypixelPlayer;
}>
