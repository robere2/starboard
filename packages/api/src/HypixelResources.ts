import {APIOptions, BaseAPI, RawResponse} from "./BaseAPI";
import {NonOptional} from "./util";
import type {HypixelAPI} from "./HypixelAPI";
import {ResourcesNotReadyError} from "./throwables";
import {HypixelEntity} from "./HypixelEntity";
import {
    ChallengesResourceSchema,
    generateChallengesResourceSchema,
    HypixelChallenge,
    GamesResourceSchema,
    generateGamesResourceSchema,
    HypixelGame,
    AchievementsResourceSchema,
    generateAchievementsResourceSchema,
    HypixelGameAchievements,
    generateQuestsResourceSchema,
    HypixelQuest,
    QuestsResourceSchema,
    generateGuildAchievementsResourceSchema,
    GuildAchievementsResourceSchema, HypixelGuildAchievements,
    generatePetsResourceSchema,
    HypixelPet,
    HypixelRarity,
    PetsResourceSchema,
    generateSkyBlockBingoResourceSchema,
    HypixelSkyBlockBingo,
    SkyBlockBingoResourceSchema,
    generateSkyBlockElectionResourceSchema,
    HypixelSkyBlockElection, HypixelSkyBlockMayor,
    SkyBlockElectionResourceSchema,
    generateSkyBlockCollectionsResourceSchema,
    HypixelSkyBlockCollection,
    SkyBlockCollectionsResourceSchema,
    generateSkyBlockSkillsResourceSchema,
    HypixelSkyBlockSkill, SkyBlockSkillsResourceSchema,
    generateSkyBlockItemsResourceSchema,
    HypixelSkyBlockItem, SkyBlockItemsResourceSchema
} from "./schemas";
import {HypixelBaseSchema} from "./schemas/hypixel/HypixelBaseSchema";
import {z} from "zod";

/**
 * Extension of {@link APIOptions} that accepts a refresh interval for resources.
 */
export type HypixelResourcesOptions = APIOptions & {
    /**
     * Number of seconds between resource refreshes. This does not bypass the {@link httpClient} cache, so if the
     * {@link httpClient}'s cache still contains the resources, it's cached values will be returned.
     * @default 3_600_000
     */
    refreshInterval?: number
}

/**
 * Interface for fetching resource endpoints from the Hypixel API. Resources are data returned by the API which do not
 * require an API key to fetch and change very infrequently.
 *
 *
 * Unlike {@link HypixelAPI} and {@link MojangAPI}, this implementation of {@link BaseAPI} fetches all resources
 * immediately, instead of waiting until you request them. Additionally, resources are refreshed at an interval,
 * regardless of whether you are using them or not. This interval can be changed by
 * {@link HypixelResourcesOptions.refreshInterval}. This is independent of the {@link HttpClient} cache policy. Thus,
 * if your {@link HttpClient} cache returns the same value, nothing changes.
 */
export class HypixelResources extends BaseAPI<HypixelResourcesOptions> {

    private ready: boolean = false;
    private readonly _rootId: string;
    private readonly refreshInterval: ReturnType<typeof setInterval>;

    private _games?: Record<string, HypixelGame>
    private _achievements?: Record<string, HypixelGameAchievements>
    private _challenges?: Record<string, HypixelChallenge[]>
    private _quests?: Record<string, HypixelQuest[]>
    private _guildAchievements?: HypixelGuildAchievements
    private _pets?: HypixelPet[]
    private _petRarities?: HypixelRarity[]
    private _companions?: HypixelPet[]
    private _companionRarities?: HypixelRarity[]
    private _skyBlockCollections?: Record<string, HypixelSkyBlockCollection>
    private _skyBlockSkills?: Record<string, HypixelSkyBlockSkill>
    private _skyBlockItems?: HypixelSkyBlockItem[]
    private _skyBlockCurrentMayor?: HypixelSkyBlockMayor | null
    private _skyBlockCurrentElection?: HypixelSkyBlockElection | null
    private _skyBlockBingo?: HypixelSkyBlockBingo | null

    private readonly gamesResourceSchema: GamesResourceSchema;
    private readonly achievementsResourceSchema: AchievementsResourceSchema;
    private readonly challengesResourceSchema: ChallengesResourceSchema;
    private readonly questsResourceSchema: QuestsResourceSchema;
    private readonly guildAchievementsResourceSchema: GuildAchievementsResourceSchema;
    private readonly petsResourceSchema: PetsResourceSchema;
    private readonly skyBlockCollectionsResourceSchema: SkyBlockCollectionsResourceSchema;
    private readonly skyBlockSkillsResourceSchema: SkyBlockSkillsResourceSchema;
    private readonly skyBlockItemsResourceSchema: SkyBlockItemsResourceSchema;
    private readonly skyBlockElectionResourceSchema: SkyBlockElectionResourceSchema;
    private readonly skyBlockBingoResourceSchema: SkyBlockBingoResourceSchema;

    private constructor(root: HypixelAPI, options: HypixelResourcesOptions) {
        super(options);
        this._rootId = root.id;
        this.gamesResourceSchema = generateGamesResourceSchema();
        this.achievementsResourceSchema = generateAchievementsResourceSchema();
        this.challengesResourceSchema = generateChallengesResourceSchema();
        this.questsResourceSchema = generateQuestsResourceSchema();
        this.guildAchievementsResourceSchema = generateGuildAchievementsResourceSchema();
        this.petsResourceSchema = generatePetsResourceSchema();
        this.skyBlockCollectionsResourceSchema = generateSkyBlockCollectionsResourceSchema();
        this.skyBlockSkillsResourceSchema = generateSkyBlockSkillsResourceSchema(root);
        this.skyBlockItemsResourceSchema = generateSkyBlockItemsResourceSchema();
        this.skyBlockElectionResourceSchema = generateSkyBlockElectionResourceSchema();
        this.skyBlockBingoResourceSchema = generateSkyBlockBingoResourceSchema();

        this.refreshInterval = setInterval(() => this.refresh(), this.options.refreshInterval)
    }

    /**
     * Create a new instance of `HypixelResources`. Instead of using this directly, you may want to use
     * {@link HypixelAPI.getResources()}.
     * @param root Parent instance of {@link HypixelAPI}.
     * @param options Options to use when creating the `HypixelResources`.
     * @returns A `Promise` that resolves to a new `HypixelResources` instance. The `Promise` resolves after all resources
     *   have been fetched to avoid a {@link ResourcesNotReadyError}.
     * @see {@link HypixelResourcesOptions}
     * @see {@link HypixelAPI}
     */
    public static async create(root: HypixelAPI, options?: HypixelResourcesOptions): Promise<HypixelResources> {
        const resources = new HypixelResources(root, options ?? {});
        await resources.refresh();
        resources.ready = true;
        return resources;
    }

    /**
     * Re-fetch all the resources from the API. This does not bypass the {@link HttpClient} cache, so any resources
     * which are still cached in the {@link HttpClient} will not change from the client's cached value. The current
     * resource values will remain available until they're overwritten by the incoming response. Each value is
     * overwritten individually, meaning while the returned `Promise` is still pending, some values may be updated while
     * others aren't.
     * @returns A `Promise` that resolves when all resources have been refreshed. Some resources may be refreshed
     * before this `Promise` resolves.
     * @throws
     * - `Error` if the HTTP request to any of the resources fails or is malformed.
     */
    public async refresh(): Promise<void> {
        await Promise.all([
            this.fetchGames().then(games => this._games = games),
            this.fetchAchievements().then(achievements => this._achievements = achievements),
            this.fetchChallenges().then(challenges => this._challenges = challenges),
            this.fetchQuests().then(quests => this._quests = quests),
            this.fetchGuildAchievements().then(guildAchievements => this._guildAchievements = guildAchievements),
            this.fetchPets().then(pets => this._pets = pets),
            this.fetchPetRarities().then(petRarities => this._petRarities = petRarities),
            this.fetchCompanions().then(companions => this._companions = companions),
            this.fetchCompanionRarities().then(companionRarities => this._companionRarities = companionRarities),
            this.fetchSkyBlockCollections().then(skyBlockCollections => this._skyBlockCollections = skyBlockCollections),
            this.fetchSkyBlockSkills().then(skyBlockSkills => this._skyBlockSkills = skyBlockSkills),
            this.fetchSkyBlockItems().then(skyBlockItems => this._skyBlockItems = skyBlockItems),
            this.fetchCurrentSkyBlockMayor().then(skyBlockCurrentMayor => this._skyBlockCurrentMayor = skyBlockCurrentMayor),
            this.fetchCurrentSkyBlockElection().then(skyBlockCurrentElection => this._skyBlockCurrentElection = skyBlockCurrentElection),
            this.fetchSkyBlockBingo().then(skyBlockBingo => this._skyBlockBingo = skyBlockBingo)
        ]);
    }

    protected async request<S extends typeof HypixelBaseSchema, V>(path: string, raw: true, schema?: S, mutator?: (input: z.infer<S>) => V): Promise<RawResponse>;
    protected async request<S extends typeof HypixelBaseSchema>(path: string, raw: false, schema: S, mutator: undefined): Promise<z.infer<S>>;
    protected async request<S extends typeof HypixelBaseSchema, V>(path: string, raw: false, schema: S, mutator: (input: z.infer<S>) => V): Promise<V>;
    protected async request<S extends typeof HypixelBaseSchema, V>(path: string, raw: boolean, schema?: S, mutator?: (input: z.infer<S>) => V): Promise<z.infer<S> | V | RawResponse> {
        // Within the mutator we check whether the request was successful, and if so, parse + mutate again.
        return await super.request(`https://api.hypixel.net/resources/${path}`, raw as any, HypixelBaseSchema.readonly(), (base) => {
            if(!base.success) {
                throw new Error(`Hypixel API Error: ${base.cause}`, {
                    cause: base.cause
                });
            }

            const parsed = schema!.parse(base);
            if(mutator) {
                return mutator(parsed);
            }
            return parsed;
        });
    }

    /**
     * Shut down this `HypixelResources` by shutting down the {@link HttpClient} and stopping the resource refreshing
     * interval.
     */
    public destroy() {
        super.destroy();
        clearInterval(this.refreshInterval)
    }

    public isReady(): boolean {
        return this.ready;
    }

    protected getRoot(): HypixelAPI {
        return HypixelEntity.getRoot(this._rootId);
    }

    /**
     * Since all the resource values are getters, we need to override `toJSON` if we want them included in the output.
     * @internal
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
     */
    public toJSON() {
        // Getters are normally not serialized with JSON.stringify. This includes them all.
        return {
            games: this.games,
            achievements: this.achievements,
            challenges: this.challenges,
            quests: this.quests,
            guildAchievements: this.guildAchievements,
            pets: this.pets,
            petRarities: this.petRarities,
            companions: this.companions,
            companionRarities: this.companionRarities,
            skyBlockCollections: this.skyBlockCollections,
            skyBlockSkills: this.skyBlockSkills,
            skyBlockItems: this.skyBlockItems,
            skyBlockCurrentMayor: this.skyBlockCurrentMayor,
            skyBlockCurrentElection: this.skyBlockCurrentElection,
            skyBlockBingo: this.skyBlockBingo
        }
    }

    public get games(): Readonly<Record<string, HypixelGame>> {
        if(!this._games) {
            throw new ResourcesNotReadyError()
        }
        return this._games;
    }

    public get achievements(): Readonly<Record<string, HypixelGameAchievements>> {
        if(!this._achievements) {
            throw new ResourcesNotReadyError()
        }
        return this._achievements;
    }

    public get challenges(): Readonly<Record<string, HypixelChallenge[]>> {
        if(!this._challenges) {
            throw new ResourcesNotReadyError()
        }
        return this._challenges;
    }

    public get quests(): Readonly<Record<string, HypixelQuest[]>> {
        if(!this._quests) {
            throw new ResourcesNotReadyError()
        }
        return this._quests;
    }

    public get flattenedQuests(): Readonly<Record<string, HypixelQuest>> {
        // Convert the quests resource from an array of quests for each game into a flattened map of quest IDs to quest object
        return Object.values(this.quests).flat().reduce((acc, quest) => {
            acc[quest.id] = quest;
            return acc;
        }, {} as Record<string, HypixelQuest>);
    }

    public get guildAchievements(): Readonly<HypixelGuildAchievements> {
        if(!this._guildAchievements) {
            throw new ResourcesNotReadyError()
        }
        return this._guildAchievements;
    }

    public get pets(): Readonly<HypixelPet[]> {
        if(!this._pets) {
            throw new ResourcesNotReadyError()
        }
        return this._pets;
    }

    public get petRarities(): Readonly<HypixelRarity[]> {
        if(!this._petRarities) {
            throw new ResourcesNotReadyError()
        }
        return this._petRarities;
    }

    public get companions(): Readonly<HypixelPet[]> {
        if(!this._companions) {
            throw new ResourcesNotReadyError()
        }
        return this._companions;
    }

    public get companionRarities(): Readonly<HypixelRarity[]> {
        if(!this._companionRarities) {
            throw new ResourcesNotReadyError()
        }
        return this._companionRarities;
    }

    public get skyBlockCollections(): Readonly<Record<string, HypixelSkyBlockCollection>> {
        if(!this._skyBlockCollections) {
            throw new ResourcesNotReadyError()
        }
        return this._skyBlockCollections;
    }

    public get skyBlockSkills(): Readonly<Record<string, HypixelSkyBlockSkill>> {
        if(!this._skyBlockSkills) {
            throw new ResourcesNotReadyError()
        }
        return this._skyBlockSkills;
    }

    public get skyBlockItems(): Readonly<HypixelSkyBlockItem[]> {
        if(!this._skyBlockItems) {
            throw new ResourcesNotReadyError()
        }
        return this._skyBlockItems;
    }

    public get skyBlockCurrentMayor(): Readonly<HypixelSkyBlockMayor> | null {
        return this._skyBlockCurrentMayor ?? null;
    }

    public get skyBlockCurrentElection(): Readonly<HypixelSkyBlockElection> | null {
        return this._skyBlockCurrentElection ?? null;
    }

    public get skyBlockBingo(): Readonly<HypixelSkyBlockBingo> | null {
        return this._skyBlockBingo ?? null;
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchGames(raw?: false): Promise<Record<string, HypixelGame>>;
    protected async fetchGames(raw?: true): Promise<RawResponse>;
    protected async fetchGames(raw = false): Promise<Record<string, HypixelGame> | RawResponse> {
        return this.request(`games`, raw as any, this.gamesResourceSchema, v => v.games)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchAchievements(raw?: false): Promise<Record<string, HypixelGameAchievements>>;
    protected async fetchAchievements(raw?: true): Promise<RawResponse>;
    protected async fetchAchievements(raw = false): Promise<Record<string, HypixelGameAchievements> | RawResponse> {
        return this.request(`achievements`, raw as any, this.achievementsResourceSchema, v => v.achievements)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchChallenges(raw?: false): Promise<Record<string, HypixelChallenge[]>>;
    protected async fetchChallenges(raw?: true): Promise<RawResponse>;
    protected async fetchChallenges(raw = false): Promise<Record<string, HypixelChallenge[]> | RawResponse> {
        return this.request(`challenges`, raw as any, this.challengesResourceSchema, (v) => v.challenges)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchQuests(raw?:  false): Promise<Record<string, HypixelQuest[]>>;
    protected async fetchQuests(raw?: true): Promise<RawResponse>;
    protected async fetchQuests(raw = false): Promise<Record<string, HypixelQuest[]> | RawResponse> {
        return this.request(`quests`, raw as any, this.questsResourceSchema, v => v.quests)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchGuildAchievements(raw?: false): Promise<HypixelGuildAchievements>;
    protected async fetchGuildAchievements(raw?: true): Promise<RawResponse>;
    protected async fetchGuildAchievements(raw = false): Promise<HypixelGuildAchievements | RawResponse> {
        return this.request(`guilds/achievements`, raw as any, this.guildAchievementsResourceSchema)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchPets(raw?: false): Promise<HypixelPet[]>;
    protected async fetchPets(raw?: true): Promise<RawResponse>;
    protected async fetchPets(raw = false): Promise<HypixelPet[] | RawResponse> {
        return this.request(`vanity/pets`, raw as any, this.petsResourceSchema, v => v.types)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchPetRarities(raw?: false): Promise<HypixelRarity[]>;
    protected async fetchPetRarities(raw?: true): Promise<RawResponse>;
    protected async fetchPetRarities(raw = false): Promise<HypixelRarity[] | RawResponse> {
        return this.request(`vanity/pets`, raw as any, this.petsResourceSchema, v => v.rarities)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchCompanions(raw?: false): Promise<HypixelPet[]>;
    protected async fetchCompanions(raw?: true): Promise<RawResponse>;
    protected async fetchCompanions(raw = false): Promise<HypixelPet[] | RawResponse> {
        return this.request(`vanity/companions`, raw as any, this.petsResourceSchema, v => v.types)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchCompanionRarities(raw?: false): Promise<HypixelRarity[]>;
    protected async fetchCompanionRarities(raw?: true): Promise<RawResponse>;
    protected async fetchCompanionRarities(raw = false): Promise<HypixelRarity[] | RawResponse> {
        return this.request(`vanity/companions`, raw as any, this.petsResourceSchema, v => v.rarities)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchSkyBlockCollections(raw?: false): Promise<Record<string,HypixelSkyBlockCollection>>;
    protected async fetchSkyBlockCollections(raw?: true): Promise<RawResponse>;
    protected async fetchSkyBlockCollections(raw = false): Promise<Record<string,HypixelSkyBlockCollection> | RawResponse> {
        return this.request(`skyblock/collections`, raw as any, this.skyBlockCollectionsResourceSchema, v => v.collections)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchSkyBlockSkills(raw?: false): Promise<Record<string, HypixelSkyBlockSkill>>;
    protected async fetchSkyBlockSkills(raw?: true): Promise<RawResponse>;
    protected async fetchSkyBlockSkills(raw = false): Promise<Record<string, HypixelSkyBlockSkill> | RawResponse> {
        return this.request(`skyblock/skills`, raw as any, this.skyBlockSkillsResourceSchema, v => v.skills)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchSkyBlockItems(raw?: false): Promise<HypixelSkyBlockItem[]>;
    protected async fetchSkyBlockItems(raw?: true): Promise<RawResponse>;
    protected async fetchSkyBlockItems(raw = false): Promise<HypixelSkyBlockItem[] | RawResponse> {
        return this.request('skyblock/items', raw as any, this.skyBlockItemsResourceSchema, v => v.items)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchCurrentSkyBlockMayor(raw?: false): Promise<HypixelSkyBlockMayor | null>;
    protected async fetchCurrentSkyBlockMayor(raw?: true): Promise<RawResponse>;
    protected async fetchCurrentSkyBlockMayor(raw = false): Promise<HypixelSkyBlockMayor | RawResponse | null> {
        return this.request(`skyblock/election`, raw as any, this.skyBlockElectionResourceSchema, v => v.mayor)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchCurrentSkyBlockElection(raw?: false): Promise<HypixelSkyBlockElection | null>;
    protected async fetchCurrentSkyBlockElection(raw?: true): Promise<RawResponse>;
    protected async fetchCurrentSkyBlockElection(raw = false): Promise<HypixelSkyBlockElection | RawResponse | null> {
        return this.request(`skyblock/election`, raw as any, this.skyBlockElectionResourceSchema, v => v.current)
    }

    /**
     * @internal
     * @param raw
     * @protected
     */
    protected async fetchSkyBlockBingo(raw?: false): Promise<HypixelSkyBlockBingo | null>;
    protected async fetchSkyBlockBingo(raw?: true): Promise<RawResponse>;
    protected async fetchSkyBlockBingo(raw = false): Promise<HypixelSkyBlockBingo | RawResponse | null> {
        return this.request(`skyblock/bingo`, raw as any, this.skyBlockBingoResourceSchema)
    }

    /**
     * @internal
     * @param options
     * @protected
     */
    protected parseOptions(options: HypixelResourcesOptions): NonOptional<HypixelResourcesOptions> {
        return Object.freeze({
            ...this.parseDefaultOptions(options),
            refreshInterval: options.refreshInterval ?? 3_600_000 // 1 hour
        })
    }

    /**
     * Override just to hide from docs
     * @override
     * @internal
     * @protected
     */
    protected genHeaders(): Headers {
        return super.genHeaders();
    }
}
