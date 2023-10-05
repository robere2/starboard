import {APIOptions, BaseAPI} from "../../../BaseAPI.ts";
import {ParsedOptions} from "../../../../util.ts";
import {HypixelGame, HypixelGamesResponse} from "./HypixelGame.ts";
import {HypixelAchievementsResponse, HypixelGameAchievements} from "./HypixelGameAchievements.ts";
import {HypixelChallenge, HypixelChallengeResponse} from "./HypixelChallenge.ts";
import {HypixelQuest, HypixelQuestsResponse} from "./HypixelQuest.ts";
import {HypixelGuildAchievements, HypixelGuildAchievementsResponse} from "./HypixelGuildAchievements.ts";
import {HypixelPet, HypixelPetsResponse} from "./HypixelPet.ts";
import {HypixelCompanion, HypixelCompanionsResponse} from "./HypixelCompanion.ts";
import {HypixelSkyBlockCollection, HypixelSkyBlockCollectionsResponse} from "./skyblock/HypixelSkyBlockCollection.ts";
import {HypixelSkyBlockSkill, HypixelSkyBlockSkillsResponse} from "./skyblock/HypixelSkyBlockSkill.ts";
import {HypixelSkyBlockItem, HypixelSkyBlockItemsResponse} from "./skyblock/HypixelSkyBlockItem.ts";
import {HypixelSkyBlockMayor} from "./skyblock/HypixelSkyBlockMayor.ts";
import {HypixelSkyBlockElection, HypixelSkyBlockElectionResponse} from "./skyblock/HypixelSkyBlockElection.ts";
import {HypixelSkyBlockBingo, HypixelSkyBlockBingoResponse} from "./skyblock/HypixelSkyBlockBingo.ts";
import {HypixelRarity} from "./HypixelRarity.ts";
import {HypixelAPIValue} from "../HypixelAPI.ts";
import {ResourcesNotReadyError} from "./ResourcesNotReadyError.ts";
import crypto from "crypto";

const HYPIXEL_RESOURCES_URL = "https://api.hypixel.net/resources";
export class HypixelResources extends BaseAPI<APIOptions> {

    // Resources get their own ID so children can reference them later without having to store them as a property. This
    //   prevents circular references, allowing you to log/serialize child values.
    public readonly id: string = crypto.randomUUID();
    private _games?: Record<string, HypixelGame>
    private _achievements?: Record<string, HypixelGameAchievements>
    private _challenges?: Record<string, HypixelChallenge[]>
    private _quests?: Record<string, HypixelQuest[]>
    private _guildAchievements?: HypixelGuildAchievements
    private _pets?: HypixelPet[]
    private _petRarities?: HypixelRarity[]
    private _companions?: HypixelCompanion[]
    private _companionRarities?: HypixelRarity[]
    private _skyBlockCollections?: Record<string, HypixelSkyBlockCollection>
    private _skyBlockSkills?: Record<string, HypixelSkyBlockSkill>
    private _skyBlockItems?: HypixelSkyBlockItem[]
    private _skyBlockCurrentMayor?: HypixelSkyBlockMayor | null
    private _skyBlockCurrentElection?: HypixelSkyBlockElection | null
    private _skyBlockBingo?: HypixelSkyBlockBingo | null

    private constructor(options: APIOptions) {
        super(options);
    }

    public static async create(options?: APIOptions): Promise<HypixelResources> {
        const resources = new HypixelResources(options ?? {});
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
        return resources;
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

    public get companions(): Readonly<HypixelCompanion[]> {
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
    public async fetchGames(raw?: true): Promise<HypixelGamesResponse>;
    public async fetchGames(raw = false): Promise<Record<string, HypixelGame> | HypixelGamesResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/games`);
        const json: HypixelGamesResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.games) {
                return {};
            }

            // Hypixel API response is not actual HypixelGame objects. HypixelGame constructor performs type checks
            const games: Record<string, HypixelGame> = {};
            for(const prop in json.games) {
                if(json.games[prop] == null) {
                    continue;
                }
                games[prop] = new HypixelGame(this, json.games[prop] as HypixelAPIValue<HypixelGame>);
            }

            return games;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchAchievements(raw?: false): Promise<Record<string, HypixelGameAchievements>>;
    public async fetchAchievements(raw?: true): Promise<HypixelAchievementsResponse>;
    public async fetchAchievements(raw = false): Promise<Record<string, HypixelGameAchievements> | HypixelAchievementsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/achievements`);
        const json: HypixelAchievementsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.achievements) {
                return {};
            }

            // Hypixel API response is not actual HypixelGameAchievements objects. HypixelGameAchievements constructor performs type checks
            const achievementsObj: Record<string, HypixelGameAchievements> = {}
            for(const prop in json.achievements) {
                if(json.achievements[prop] == null) {
                    continue;
                }
                achievementsObj[prop] = new HypixelGameAchievements(this, json.achievements[prop] as HypixelAPIValue<HypixelGameAchievements>);
            }

            return achievementsObj;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchChallenges(raw?: false): Promise<Record<string, HypixelChallenge[]>>;
    public async fetchChallenges(raw?: true): Promise<HypixelChallengeResponse>;
    public async fetchChallenges(raw = false): Promise<Record<string, HypixelChallenge[]> | HypixelChallengeResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/challenges`);
        const json: HypixelChallengeResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.challenges) {
                return {};
            }

            // Hypixel API response is not actual HypixelChallenge objects. HypixelChallenge constructor performs type checks
            const challenges: Record<string, HypixelChallenge[]> = {}
            for(const game in json.challenges) {
                if(json.challenges[game] == null) {
                    continue;
                }
                const gameChallengesInput: HypixelAPIValue<HypixelChallenge>[] = json.challenges[game] as HypixelAPIValue<HypixelChallenge>[];
                const gameChallenges: HypixelChallenge[] = [];
                for(let i = 0; i < gameChallengesInput.length; i++) {
                    if(gameChallengesInput[i] == null) {
                        continue;
                    }
                    gameChallenges[i] = new HypixelChallenge(this, gameChallengesInput[i]);
                }
                challenges[game] = gameChallenges;
            }

            return challenges;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchQuests(raw?:  false): Promise<Record<string, HypixelQuest[]>>;
    public async fetchQuests(raw?: true): Promise<HypixelQuestsResponse>;
    public async fetchQuests(raw = false): Promise<Record<string, HypixelQuest[]> | HypixelQuestsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/quests`);
        const json: HypixelQuestsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.quests) {
                return {};
            }

            // Hypixel API response is not actual HypixelQuest objects. HypixelQuest constructor performs type checks
            const quests: Record<string, HypixelQuest[]> = {}
            for(const game in json.quests) {
                if(json.quests[game] == null) {
                    continue;
                }
                const gameQuestsInput: HypixelAPIValue<HypixelQuest>[] = json.quests[game] as HypixelAPIValue<HypixelQuest>[];
                const gameQuests: HypixelQuest[] = [];
                for(let i = 0; i < gameQuestsInput.length; i++) {
                    if(gameQuestsInput[i] == null) {
                        continue;
                    }
                    gameQuests[i] = new HypixelQuest(this, gameQuestsInput[i]);
                }
                quests[game] = gameQuests;
            }

            return quests;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchGuildAchievements(raw?: false): Promise<HypixelGuildAchievements>;
    public async fetchGuildAchievements(raw?: true): Promise<HypixelGuildAchievementsResponse>;
    public async fetchGuildAchievements(raw = false): Promise<HypixelGuildAchievements | HypixelGuildAchievementsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/guilds/achievements`);
        const json: HypixelGuildAchievementsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            return new HypixelGuildAchievements(this, {
                one_time: json?.one_time ?? {},
                tiered: json.tiered ?? {}
            })
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchPets(raw?: false): Promise<HypixelPet[]>;
    public async fetchPets(raw?: true): Promise<HypixelPetsResponse>;
    public async fetchPets(raw = false): Promise<HypixelPet[] | HypixelPetsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/vanity/pets`);
        const json: HypixelPetsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.types) {
                return [];
            }

            const pets: HypixelPet[] = [];
            for(const pet of json.types) {
                if(!pet) {
                    continue;
                }
                pets.push(new HypixelPet(this, pet));
            }
            return pets;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchPetRarities(raw?: false): Promise<HypixelRarity[]>;
    public async fetchPetRarities(raw?: true): Promise<HypixelPetsResponse>;
    public async fetchPetRarities(raw = false): Promise<HypixelRarity[] | HypixelPetsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/vanity/pets`);
        const json: HypixelPetsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.rarities) {
                return [];
            }

            const rarities: HypixelRarity[] = [];
            for(const rarity of json.rarities) {
                if(!rarity) {
                    continue;
                }
                rarities.push(new HypixelRarity(this, rarity));
            }
            return rarities;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchCompanions(raw?: false): Promise<HypixelCompanion[]>;
    public async fetchCompanions(raw?: true): Promise<HypixelCompanionsResponse>;
    public async fetchCompanions(raw = false): Promise<HypixelCompanion[] | HypixelCompanionsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/vanity/companions`);
        const json: HypixelCompanionsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.types) {
                return [];
            }

            const companions: HypixelCompanion[] = [];
            for(const companion of json.types) {
                if(!companion) {
                    continue;
                }
                companions.push(new HypixelCompanion(this, companion));
            }
            return companions;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchCompanionRarities(raw?: false): Promise<HypixelRarity[]>;
    public async fetchCompanionRarities(raw?: true): Promise<HypixelCompanionsResponse>;
    public async fetchCompanionRarities(raw = false): Promise<HypixelRarity[] | HypixelCompanionsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/vanity/companions`);
        const json: HypixelCompanionsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.rarities) {
                return [];
            }

            const rarities: HypixelRarity[] = [];
            for(const rarity of json.rarities) {
                if(!rarity) {
                    continue;
                }
                rarities.push(new HypixelRarity(this, rarity));
            }
            return rarities;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchSkyBlockCollections(raw?: false): Promise<Record<string,HypixelSkyBlockCollection>>;
    public async fetchSkyBlockCollections(raw?: true): Promise<HypixelSkyBlockCollectionsResponse>;
    public async fetchSkyBlockCollections(raw = false): Promise<Record<string,HypixelSkyBlockCollection> | HypixelSkyBlockCollectionsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/skyblock/collections`);
        const json: HypixelSkyBlockCollectionsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.collections) {
                return {};
            }

            const collections: Record<string, HypixelSkyBlockCollection> = {};
            for(const collection in json.collections) {
                if(!json.collections[collection]) {
                    continue;
                }
                collections[collection] = new HypixelSkyBlockCollection(this, json.collections[collection] as HypixelSkyBlockCollection);
            }

            return collections;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchSkyBlockSkills(raw?: false): Promise<Record<string, HypixelSkyBlockSkill>>;
    public async fetchSkyBlockSkills(raw?: true): Promise<HypixelSkyBlockSkillsResponse>;
    public async fetchSkyBlockSkills(raw = false): Promise<Record<string, HypixelSkyBlockSkill> | HypixelSkyBlockSkillsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/skyblock/skills`);
        const json: HypixelSkyBlockSkillsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.skills) {
                return {};
            }

            const skills: Record<string, HypixelSkyBlockSkill> = {};
            for(const skill in json.skills) {
                if(!skill) {
                    continue;
                }
                skills[skill] = new HypixelSkyBlockSkill(this, json.skills[skill] as HypixelSkyBlockSkill);
            }
            return skills;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchSkyBlockItems(raw?: false): Promise<HypixelSkyBlockItem[]>;
    public async fetchSkyBlockItems(raw?: true): Promise<HypixelSkyBlockItemsResponse>;
    public async fetchSkyBlockItems(raw = false): Promise<HypixelSkyBlockItem[] | HypixelSkyBlockItemsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/skyblock/items`);
        const json: HypixelSkyBlockItemsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.items) {
                return [];
            }

            const items: HypixelSkyBlockItem[] = [];
            for(const item of json.items) {
                if(!item) {
                    continue;
                }
                items.push(new HypixelSkyBlockItem(this, item));
            }
            return items;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchCurrentSkyBlockMayor(raw?: false): Promise<HypixelSkyBlockMayor | null>;
    public async fetchCurrentSkyBlockMayor(raw?: true): Promise<HypixelSkyBlockElectionResponse>;
    public async fetchCurrentSkyBlockMayor(raw = false): Promise<HypixelSkyBlockMayor | HypixelSkyBlockElectionResponse | null> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/skyblock/election`);
        const json: HypixelSkyBlockElectionResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            return json.mayor == null ? null : new HypixelSkyBlockMayor(this, json.mayor)
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchCurrentSkyBlockElection(raw?: false): Promise<HypixelSkyBlockElection | null>;
    public async fetchCurrentSkyBlockElection(raw?: true): Promise<HypixelSkyBlockElectionResponse>;
    public async fetchCurrentSkyBlockElection(raw = false): Promise<HypixelSkyBlockElection | HypixelSkyBlockElectionResponse | null> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/skyblock/election`);
        const json: HypixelSkyBlockElectionResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            return json.current == null ? null : new HypixelSkyBlockElection(this, json.current)
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async fetchSkyBlockBingo(raw?: false): Promise<HypixelSkyBlockBingo | null>;
    public async fetchSkyBlockBingo(raw?: true): Promise<HypixelSkyBlockBingoResponse>;
    public async fetchSkyBlockBingo(raw = false): Promise<HypixelSkyBlockBingo | HypixelSkyBlockBingoResponse | null> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/skyblock/bingo`);
        const json: HypixelSkyBlockBingoResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {

            if(json.id == null) {
                return null;
            }
            return new HypixelSkyBlockBingo(this, {
                id: json.id,
                goals: json.goals
            })
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    protected parseOptions(options: APIOptions): ParsedOptions<APIOptions> {
        return this.parseDefaultOptions(options);
    }
}
