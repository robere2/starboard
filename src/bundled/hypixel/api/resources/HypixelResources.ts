import {APIOptions, BaseAPI} from "../../../BaseAPI.ts";
import {ParsedOptions} from "../../../../util.ts";
import {HypixelGame, HypixelGamesResponse} from "./HypixelGame.ts";
import {HypixelAchievementsResponse, HypixelGameAchievements} from "./HypixelGameAchievements.ts";
import {HypixelChallenge, HypixelChallengeResponse} from "./HypixelChallenge.ts";
import {HypixelQuest, HypixelQuestResponse} from "./HypixelQuest.ts";
import {HypixelGuildAchievements, HypixelGuildAchievementsResponse} from "./HypixelGuildAchievements.ts";
import {HypixelPet, HypixelPetsResponse} from "./HypixelPet.ts";
import {HypixelCompanion, HypixelCompanionsResponse} from "./HypixelCompanion.ts";
import {HypixelSkyBlockCollection, HypixelSkyBlockCollectionsResponse} from "./skyblock/HypixelSkyBlockCollection.ts";
import {HypixelSkyBlockSkill, HypixelSkyBlockSkillsResponse} from "./skyblock/HypixelSkyBlockSkill.ts";
import {HypixelSkyBlockItem, HypixelSkyBlockItemsResponse} from "./skyblock/HypixelSkyBlockItem.ts";
import {HypixelSkyBlockMayor} from "./skyblock/HypixelSkyBlockMayor.ts";
import {HypixelSkyBlockElection, HypixelSkyBlockElectionResponse} from "./skyblock/HypixelSkyBlockElection.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelSkyBlockBingo, HypixelSkyBlockBingoResponse} from "./skyblock/HypixelSkyBlockBingo.ts";
import {HypixelRarity} from "./HypixelRarity.ts";

const HYPIXEL_RESOURCES_URL = "https://api.hypixel.net/resources";
export class HypixelResources extends BaseAPI<APIOptions> {



    public async getGames(): Promise<Record<string, HypixelGame>> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/games`);
        const json: HypixelGamesResponse = await res.json();
        if(json.success) {
            if(!json.games) {
                return {};
            }

            // Hypixel API response is not actual HypixelGame objects. HypixelGame constructor performs type checks
            const typedGames = json.games as Record<string, HypixelGame>
            for(const prop in typedGames) {
                typedGames[prop] = new HypixelGame(typedGames[prop]);
            }

            return typedGames;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getAchievements(): Promise<Record<string, HypixelGameAchievements>> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/achievements`);
        const json: HypixelAchievementsResponse = await res.json();
        if(json.success) {
            if(!json.achievements) {
                return {};
            }

            // Hypixel API response is not actual HypixelGameAchievements objects. HypixelGameAchievements constructor performs type checks
            const typedAchievements = json.achievements as Record<string, HypixelGameAchievements>
            for(const prop in typedAchievements) {
                typedAchievements[prop] = new HypixelGameAchievements(typedAchievements[prop]);
            }

            return typedAchievements;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getChallenges(): Promise<Record<string, HypixelChallenge[]>> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/challenges`);
        const json: HypixelChallengeResponse = await res.json();
        if(json.success) {
            if(!json.challenges) {
                return {};
            }

            // Hypixel API response is not actual HypixelChallenge objects. HypixelChallenge constructor performs type checks
            const typedChallenges = json.challenges as Record<string, HypixelChallenge[]>
            for(const game in typedChallenges) {

                for(let i = 0; i < typedChallenges[game].length; i++) {
                    typedChallenges[game][i] = new HypixelChallenge(typedChallenges[game][i]);
                }
            }

            return typedChallenges;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getQuests(): Promise<Record<string, HypixelQuest[]>> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/quests`);
        const json: HypixelQuestResponse = await res.json();
        if(json.success) {
            if(!json.quests) {
                return {};
            }

            // Hypixel API response is not actual HypixelQuest objects. HypixelQuest constructor performs type checks
            const typedQuests = json.quests as Record<string, HypixelQuest[]>
            for(const game in typedQuests) {
                for(let i = 0; i < typedQuests[game].length; i++) {
                    typedQuests[game][i] = new HypixelQuest(typedQuests[game][i]);
                }
            }

            return typedQuests;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getGuildAchievements(): Promise<HypixelGuildAchievements> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/guilds/achievements`);
        const json: HypixelGuildAchievementsResponse = await res.json();
        if(json.success) {
            return new HypixelGuildAchievements({
                one_time: json?.one_time ?? {},
                tiered: json.tiered ?? {}
            })
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getPets(): Promise<HypixelPet[]> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/vanity/pets`);
        const json: HypixelPetsResponse = await res.json();
        if(json.success) {
            if(!json.types) {
                return [];
            }

            const pets: HypixelPet[] = [];
            for(const pet of json.types) {
                if(!pet) {
                    continue;
                }
                pets.push(new HypixelPet(pet));
            }
            return pets;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getPetRarities(): Promise<HypixelRarity[]> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/vanity/pets`);
        const json: HypixelPetsResponse = await res.json();
        if(json.success) {
            if(!json.rarities) {
                return [];
            }

            const rarities: HypixelRarity[] = [];
            for(const rarity of json.rarities) {
                if(!rarity) {
                    continue;
                }
                rarities.push(new HypixelRarity(rarity));
            }
            return rarities;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getCompanions(): Promise<HypixelCompanion[]> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/vanity/companions`);
        const json: HypixelCompanionsResponse = await res.json();
        if(json.success) {
            if(!json.types) {
                return [];
            }

            const companions: HypixelCompanion[] = [];
            for(const companion of json.types) {
                if(!companion) {
                    continue;
                }
                companions.push(new HypixelCompanion(companion));
            }
            return companions;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getCompanionRarities(): Promise<HypixelRarity[]> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/vanity/companions`);
        const json: HypixelCompanionsResponse = await res.json();
        if(json.success) {
            if(!json.rarities) {
                return [];
            }

            const rarities: HypixelRarity[] = [];
            for(const rarity of json.rarities) {
                if(!rarity) {
                    continue;
                }
                rarities.push(new HypixelRarity(rarity));
            }
            return rarities;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockCollections(): Promise<Record<string,HypixelSkyBlockCollection>> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/skyblock/collections`);
        const json: HypixelSkyBlockCollectionsResponse = await res.json();
        if(json.success) {
            if(!json.collections) {
                return {};
            }

            const collections: Record<string, HypixelSkyBlockCollection> = {};
            for(const collection in json.collections) {
                if(!json.collections[collection]) {
                    continue;
                }
                collections[collection] = new HypixelSkyBlockCollection(json.collections[collection] as HypixelSkyBlockCollection);
            }

            return collections;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockSkills(): Promise<Record<string, HypixelSkyBlockSkill>> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/skyblock/skills`);
        const json: HypixelSkyBlockSkillsResponse = await res.json();
        if(json.success) {
            if(!json.collections) {
                return {};
            }

            const skills: Record<string, HypixelSkyBlockSkill> = {};
            for(const skill in json.collections) {
                if(!skill) {
                    continue;
                }
                skills[skill] = new HypixelSkyBlockSkill(json.collections[skill] as HypixelSkyBlockSkill);
            }
            return skills;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockItems(): Promise<HypixelSkyBlockItem[]> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/skyblock/items`);
        const json: HypixelSkyBlockItemsResponse = await res.json();
        if(json.success) {
            if(!json.items) {
                return [];
            }

            const items: HypixelSkyBlockItem[] = [];
            for(const item of json.items) {
                if(!item) {
                    continue;
                }
                items.push(new HypixelSkyBlockItem(item));
            }
            return items;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getCurrentSkyBlockMayor(): Promise<HypixelSkyBlockMayor> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/skyblock/election`);
        const json: HypixelSkyBlockElectionResponse = await res.json();
        if(json.success) {
            if(!json.mayor) {
                throw new HypixelParseError("No mayor elected", json);
            }

            return new HypixelSkyBlockMayor(json.mayor)
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getCurrentSkyBlockElection(): Promise<HypixelSkyBlockElection> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/skyblock/election`);
        const json: HypixelSkyBlockElectionResponse = await res.json();
        if(json.success) {
            if(!json.current) {
                throw new HypixelParseError("No ongoing election", json);
            }

            return new HypixelSkyBlockElection(json.current)
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockBingo(): Promise<HypixelSkyBlockBingo> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_RESOURCES_URL}/skyblock/bingo`);
        const json: HypixelSkyBlockBingoResponse = await res.json();
        if(json.success) {
            if(!json.id) {
                throw new HypixelParseError("No Bingo ID found", json);
            }

            return new HypixelSkyBlockBingo({
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
