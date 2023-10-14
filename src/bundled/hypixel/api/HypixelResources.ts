import {APIOptions, BaseAPI, BaseResponse, BaseSchema} from "../../BaseAPI.ts";
import {ParsedOptions} from "../../../util.ts";
import type {HypixelAPI} from "./HypixelAPI.ts";
import {ResourcesNotReadyError} from "./throwables/ResourcesNotReadyError.ts";
import {HypixelEntity} from "./HypixelEntity.ts";
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
import {TypeOf} from "zod";

export class HypixelResources extends BaseAPI<APIOptions> {

    private ready: boolean = false;
    private readonly _rootId: string;

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

    private constructor(root: HypixelAPI, options: APIOptions) {
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
    }

    public static async create(root: HypixelAPI, options?: APIOptions): Promise<HypixelResources> {
        const resources = new HypixelResources(root, options ?? {});
        resources._games = await resources.fetchGames();
        resources._achievements = await resources.fetchAchievements();
        resources._challenges = await resources.fetchChallenges();
        resources._quests = await resources.fetchQuests();
        resources._guildAchievements = await resources.fetchGuildAchievements();
        resources._pets = await resources.fetchPets();
        resources._petRarities = await resources.fetchPetRarities();
        resources._companions = await resources.fetchCompanions();
        resources._companionRarities = await resources.fetchCompanionRarities();
        resources._skyBlockCollections = await resources.fetchSkyBlockCollections();
        resources._skyBlockSkills = await resources.fetchSkyBlockSkills();
        resources._skyBlockItems = await resources.fetchSkyBlockItems();
        resources._skyBlockCurrentMayor = await resources.fetchCurrentSkyBlockMayor();
        resources._skyBlockCurrentElection = await resources.fetchCurrentSkyBlockElection();
        resources._skyBlockBingo = await resources.fetchSkyBlockBingo();
        resources.ready = true;
        return resources;
    }

    protected async request<T extends typeof BaseSchema, U>(path: string, raw: boolean, schema: T, mutator?: (input: TypeOf<T>) => U): Promise<BaseResponse | U> {
        return super.request(`https://api.hypixel.net/resources/${path}`, raw, schema, mutator);
    }

    public isReady(): boolean {
        return this.ready;
    }

    protected getRoot(): HypixelAPI {
        return HypixelEntity.getRoot(this._rootId);
    }

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

    public async fetchGames(raw?: false): Promise<Record<string, HypixelGame>>;
    public async fetchGames(raw?: true): Promise<BaseResponse>;
    public async fetchGames(raw = false): Promise<Record<string, HypixelGame> | BaseResponse> {
        return this.request(`games`, raw, this.gamesResourceSchema, v => v.games)
    }

    public async fetchAchievements(raw?: false): Promise<Record<string, HypixelGameAchievements>>;
    public async fetchAchievements(raw?: true): Promise<BaseResponse>;
    public async fetchAchievements(raw = false): Promise<Record<string, HypixelGameAchievements> | BaseResponse> {
        return this.request(`achievements`, raw, this.achievementsResourceSchema, v => v.achievements)
    }

    public async fetchChallenges(raw?: false): Promise<Record<string, HypixelChallenge[]>>;
    public async fetchChallenges(raw?: true): Promise<BaseResponse>;
    public async fetchChallenges(raw = false): Promise<Record<string, HypixelChallenge[]> | BaseResponse> {
        return this.request(`challenges`, raw, this.challengesResourceSchema, (v) => v.challenges)
    }

    public async fetchQuests(raw?:  false): Promise<Record<string, HypixelQuest[]>>;
    public async fetchQuests(raw?: true): Promise<BaseResponse>;
    public async fetchQuests(raw = false): Promise<Record<string, HypixelQuest[]> | BaseResponse> {
        return this.request(`quests`, raw, this.questsResourceSchema, v => v.quests)
    }

    public async fetchGuildAchievements(raw?: false): Promise<HypixelGuildAchievements>;
    public async fetchGuildAchievements(raw?: true): Promise<BaseResponse>;
    public async fetchGuildAchievements(raw = false): Promise<HypixelGuildAchievements | BaseResponse> {
        return this.request(`guilds/achievements`, raw, this.guildAchievementsResourceSchema)
    }

    public async fetchPets(raw?: false): Promise<HypixelPet[]>;
    public async fetchPets(raw?: true): Promise<BaseResponse>;
    public async fetchPets(raw = false): Promise<HypixelPet[] | BaseResponse> {
        return this.request(`vanity/pets`, raw, this.petsResourceSchema, v => v.types)
    }

    public async fetchPetRarities(raw?: false): Promise<HypixelRarity[]>;
    public async fetchPetRarities(raw?: true): Promise<BaseResponse>;
    public async fetchPetRarities(raw = false): Promise<HypixelRarity[] | BaseResponse> {
        return this.request(`vanity/pets`, raw, this.petsResourceSchema, v => v.rarities)
    }

    public async fetchCompanions(raw?: false): Promise<HypixelPet[]>;
    public async fetchCompanions(raw?: true): Promise<BaseResponse>;
    public async fetchCompanions(raw = false): Promise<HypixelPet[] | BaseResponse> {
        return this.request(`vanity/companions`, raw, this.petsResourceSchema, v => v.types)
    }

    public async fetchCompanionRarities(raw?: false): Promise<HypixelRarity[]>;
    public async fetchCompanionRarities(raw?: true): Promise<BaseResponse>;
    public async fetchCompanionRarities(raw = false): Promise<HypixelRarity[] | BaseResponse> {
        return this.request(`vanity/companions`, raw, this.petsResourceSchema, v => v.rarities)
    }

    public async fetchSkyBlockCollections(raw?: false): Promise<Record<string,HypixelSkyBlockCollection>>;
    public async fetchSkyBlockCollections(raw?: true): Promise<BaseResponse>;
    public async fetchSkyBlockCollections(raw = false): Promise<Record<string,HypixelSkyBlockCollection> | BaseResponse> {
        return this.request(`skyblock/collections`, raw, this.skyBlockCollectionsResourceSchema, v => v.collections)
    }

    public async fetchSkyBlockSkills(raw?: false): Promise<Record<string, HypixelSkyBlockSkill>>;
    public async fetchSkyBlockSkills(raw?: true): Promise<BaseResponse>;
    public async fetchSkyBlockSkills(raw = false): Promise<Record<string, HypixelSkyBlockSkill> | BaseResponse> {
        return this.request(`skyblock/skills`, raw, this.skyBlockSkillsResourceSchema, v => v.skills)
    }

    public async fetchSkyBlockItems(raw?: false): Promise<HypixelSkyBlockItem[]>;
    public async fetchSkyBlockItems(raw?: true): Promise<BaseResponse>;
    public async fetchSkyBlockItems(raw = false): Promise<HypixelSkyBlockItem[] | BaseResponse> {
        return this.request('skyblock/items', raw, this.skyBlockItemsResourceSchema, v => v.items)
    }

    public async fetchCurrentSkyBlockMayor(raw?: false): Promise<HypixelSkyBlockMayor | null>;
    public async fetchCurrentSkyBlockMayor(raw?: true): Promise<BaseResponse>;
    public async fetchCurrentSkyBlockMayor(raw = false): Promise<HypixelSkyBlockMayor | BaseResponse | null> {
        return this.request(`skyblock/election`, raw, this.skyBlockElectionResourceSchema, v => v.mayor)
    }

    public async fetchCurrentSkyBlockElection(raw?: false): Promise<HypixelSkyBlockElection | null>;
    public async fetchCurrentSkyBlockElection(raw?: true): Promise<BaseResponse>;
    public async fetchCurrentSkyBlockElection(raw = false): Promise<HypixelSkyBlockElection | BaseResponse | null> {
        return this.request(`skyblock/election`, raw, this.skyBlockElectionResourceSchema, v => v.current)
    }

    public async fetchSkyBlockBingo(raw?: false): Promise<HypixelSkyBlockBingo | null>;
    public async fetchSkyBlockBingo(raw?: true): Promise<BaseResponse>;
    public async fetchSkyBlockBingo(raw = false): Promise<HypixelSkyBlockBingo | BaseResponse | null> {
        return this.request(`skyblock/bingo`, raw, this.skyBlockBingoResourceSchema)
    }

    protected parseOptions(options: APIOptions): ParsedOptions<APIOptions> {
        return this.parseDefaultOptions(options);
    }
}
