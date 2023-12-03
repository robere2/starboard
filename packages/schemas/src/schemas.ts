import {dirname, join} from "path";
import {SchemaData} from "./SchemaData.js";
import {fileURLToPath} from "url";
import {pickRandom} from "./util.js";

const __dirname = dirname(fileURLToPath(import.meta.url))

function getUrlsForSkyBlockProfile(id: string): [string, SchemaData][] {
    return [
        [`https://api.hypixel.net/v2/skyblock/museum?profile=${id}`, HypixelSkyBlockMuseum],
        [`https://api.hypixel.net/v2/skyblock/profile?profile=${id}`, HypixelSkyBlockProfile]
    ]
}
function getUrlsForPlayer(uuid: string): [string, SchemaData][] {
    return [
        [`https://api.hypixel.net/v2/status?uuid=${uuid}`, HypixelStatus],
        [`https://api.hypixel.net/v2/recentgames?uuid=${uuid}`, HypixelRecentGames],
        [`https://api.hypixel.net/v2/player?uuid=${uuid}`, HypixelPlayer],
        [`https://api.hypixel.net/v2/skyblock/bingo?uuid=${uuid}`, HypixelSkyBlockBingoProfile]
    ]
}

const inDir = join(__dirname, 'schemas', 'hypixel');
const outDir = join(__dirname, '..', 'dist', 'types');

export const HypixelSkyBlockBingoGoal: SchemaData = {
    defName: "HypixelSkyBlockBingoGoal",
    schemaPath: join(inDir, 'resources', 'skyblock', 'bingo.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.goals,
}

export const HypixelSkyBlockCollections: SchemaData = {
    defName: "HypixelSkyBlockCollections",
    schemaPath: join(inDir, 'resources', 'skyblock', 'collections.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.collections,
}

export const HypixelSkyBlockMayor: SchemaData = {
    defName: "HypixelSkyBlockMayor",
    schemaPath: join(inDir, 'resources', 'skyblock', 'election.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.mayor,
}

export const HypixelSkyBlockElection: SchemaData = {
    defName: "HypixelSkyBlockElection",
    schemaPath: join(inDir, 'resources', 'skyblock', 'election.json'),
    postProcess: (input) => input.current,
}

export const HypixelSkyBlockItem: SchemaData = {
    defName: "HypixelSkyBlockItem",
    schemaPath: join(inDir, 'resources', 'skyblock', 'items.json'),
    postProcess: (input) => input.items,
}

export const HypixelSkyBlockSkills: SchemaData = {
    defName: "HypixelSkyBlockSkills",
    schemaPath: join(inDir, 'resources', 'skyblock', 'skills.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.collections,
}

export const HypixelAchievements: SchemaData = {
    defName: "HypixelAchievements",
    schemaPath: join(inDir, 'resources', 'achievements.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.achievements,
}

export const HypixelChallenges: SchemaData = {
    defName: "HypixelChallenges",
    schemaPath: join(inDir, 'resources', 'challenges.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.challenges
}

export const HypixelGames: SchemaData = {
    defName: "HypixelGames",
    schemaPath: join(inDir, 'resources', 'games.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.games
}

export const HypixelGuildAchievements: SchemaData = {
    defName: "HypixelGuildAchievements",
    schemaPath: join(inDir, 'resources', 'guilds', 'achievements.json'),
    dtsOutDir: outDir
}

export const HypixelPet: SchemaData = {
    defName: "HypixelPet",
    schemaPath: join(inDir, 'resources', 'vanity', 'pets.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.types
}

export const HypixelPetRarity: SchemaData = {
    defName: "HypixelPetRarity",
    schemaPath: join(inDir, 'resources', 'vanity', 'pets.json'),
    postProcess: (input) => input.rarities
}

export const HypixelCompanion: SchemaData = {
    defName: "HypixelCompanion",
    schemaPath: join(inDir, 'resources', 'vanity', 'companions.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.types
}

export const HypixelCompanionRarity: SchemaData = {
    defName: "HypixelCompanionRarity",
    schemaPath: join(inDir, 'resources', 'vanity', 'companions.json'),
    postProcess: (input) => input.rarities
}

export const HypixelQuests: SchemaData = {
    defName: "HypixelQuests",
    schemaPath: join(inDir, 'resources', 'quests.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.quests
}

export const HypixelPlayerCounts: SchemaData = {
    defName: "HypixelPlayerCounts",
    schemaPath: join(inDir, 'counts.json'),
    dtsOutDir: outDir
}

export const HypixelPunishmentStatistics: SchemaData = {
    defName: "HypixelPunishmentStatistics",
    schemaPath: join(inDir, 'punishmentstats.json'),
    dtsOutDir: outDir
}

export const HypixelStatus: SchemaData = {
    defName: "HypixelStatus",
    schemaPath: join(inDir, 'status.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.session,
}

export const HypixelRecentGames: SchemaData = {
    defName: "HypixelRecentGame",
    schemaPath: join(inDir, 'recentgames.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.games,
}

export const HypixelBooster: SchemaData = {
    defName: "HypixelBooster",
    schemaPath: join(inDir, 'boosters.json'),
    dtsOutDir: outDir,
    postProcess: (input, addUrl) => {
        // Flatten all leaderboards down into an array containing just player UUIDs, then pass to the Set constructor to
        // remove duplicates. Spread back into array so we can get values at an index.
        const allUniqueBoosterPurchasers = [
            ...new Set<string>(input.boosters?.map((b: any) => b.purchaserUuid) ?? [])
        ].filter(uuid => !!uuid)

        pickRandom(allUniqueBoosterPurchasers, 10).forEach(uuid => {
            getUrlsForPlayer(uuid).forEach(url => addUrl(url))
        });

        return input.boosters
    }
}

export const HypixelLeaderboards: SchemaData = {
    defName: "HypixelLeaderboards",
    schemaPath: join(inDir, 'leaderboards.json'),
    dtsOutDir: outDir,
    postProcess: (input, addUrl) => {


        // Flatten all leaderboards down into an array containing just player UUIDs, then pass to the Set constructor to
        // remove duplicates. Spread back into array so we can get values at an index.
        const allUniqueLeaderboardPlayers = [
            ...new Set<string>(
                Object.values(input.leaderboards ?? {})
                    .flat()
                    .map(v => (v as any).leaders ?? [])
                    .flat()
            )
        ].filter(uuid => !!uuid)

        pickRandom(allUniqueLeaderboardPlayers, 20).forEach(uuid => {
            getUrlsForPlayer(uuid).forEach(url => addUrl(url))
        });

        pickRandom(allUniqueLeaderboardPlayers, 5).forEach(uuid => {
            addUrl([`https://api.hypixel.net/v2/guild?player=${uuid}`, HypixelGuild])
        });

        return input.leaderboards
    }
}

let sbProfilesAdded = 0;
const maxSbProfilesToAdd = 15;
export const HypixelPlayer: SchemaData = {
    defName: "HypixelPlayer",
    schemaPath: join(inDir, 'player.json'),
    dtsOutDir: outDir,
    postProcess: (input, addUrl) => {
        if(sbProfilesAdded < maxSbProfilesToAdd) {
            sbProfilesAdded++;
            const playerProfiles = Object.values(input.player?.stats?.SkyBlock?.profiles ?? {});
            const randomProfile = pickRandom(playerProfiles, 1);
            if(randomProfile && (randomProfile as any).profile_id) {
                getUrlsForSkyBlockProfile((randomProfile as any).profile_id).forEach(url => {
                    addUrl(url);
                })
            }
        }

        return input.player
    }
}

export const HypixelGuild: SchemaData = {
    defName: "HypixelGuild",
    schemaPath: join(inDir, 'guild.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.guild
}

export const HypixelSkyBlockAuction: SchemaData = {
    defName: "HypixelSkyBlockAuction",
    schemaPath: join(inDir, 'skyblock', 'auctions.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.auctions
}

export const HypixelSkyBlockEndedAuction: SchemaData = {
    defName: "HypixelSkyBlockEndedAuction",
    schemaPath: join(inDir, 'skyblock', 'auctions_ended.json'),
    dtsOutDir: outDir,
    postProcess: (input, addUrl) => {
        // Flatten all leaderboards down into an array containing just player UUIDs, then pass to the Set constructor to
        // remove duplicates. Spread back into array so we can get values at an index.
        const allUniqueProfiles = [
            ...new Set<string>(
                input.auctions?.map((auction: any) => auction.seller_profile)
            )
        ].filter(uuid => !!uuid)
        const allUniquePlayers = [
            ...new Set<string>(
                input.auctions?.map((auction: any) => [auction.seller, auction.buyer]).flat()
            )
        ].filter(uuid => !!uuid)

        pickRandom(allUniqueProfiles, 25).forEach(id => {
            getUrlsForSkyBlockProfile(id).forEach(url => addUrl(url))
        });
        pickRandom(allUniquePlayers, 15).forEach(uuid => {
            getUrlsForPlayer(uuid).forEach(url => addUrl(url))
        });

        return input.auctions;
    }
}

export const HypixelSkyBlockBazaarProducts: SchemaData = {
    defName: "HypixelSkyBlockBazaarProducts",
    schemaPath: join(inDir, 'skyblock', 'bazaar.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.products
}

export const HypixelSkyBlockBingoProfile: SchemaData = {
    defName: "HypixelSkyBlockBingoProfile",
    schemaPath: join(inDir, 'skyblock', 'bingo.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.events
}

export const HypixelSkyBlockFireSale: SchemaData = {
    defName: "HypixelSkyBlockFireSale",
    schemaPath: join(inDir, 'skyblock', 'firesales.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.sales
}

export const HypixelSkyBlockMuseum: SchemaData = {
    defName: "HypixelSkyBlockMuseum",
    schemaPath: join(inDir, 'skyblock', 'museum.json'),
    dtsOutDir: outDir,
    postProcess: (input) => Object.values(input.members)
}

export const HypixelSkyBlockNews: SchemaData = {
    defName: "HypixelSkyBlockNews",
    schemaPath: join(inDir, 'skyblock', 'news.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.items
}

export const HypixelSkyBlockProfile: SchemaData = {
    defName: "HypixelSkyBlockProfile",
    schemaPath: join(inDir, 'skyblock', 'profile.json'),
    dtsOutDir: outDir,
    postProcess: (input) => input.profile
}

export const initialGenerationUrlList: [string, SchemaData][] = [
    // Since these add additional URLs, prioritizing these 3 first will give us a more accurate percentage complete
    ["https://api.hypixel.net/v2/boosters", HypixelBooster],
    ["https://api.hypixel.net/v2/leaderboards", HypixelLeaderboards],
    ["https://api.hypixel.net/v2/skyblock/auctions_ended", HypixelSkyBlockEndedAuction],

    ["https://api.hypixel.net/v2/resources/skyblock/bingo", HypixelSkyBlockBingoGoal],
    ["https://api.hypixel.net/v2/resources/skyblock/collections", HypixelSkyBlockCollections],
    ["https://api.hypixel.net/v2/resources/skyblock/election", HypixelSkyBlockMayor],
    ["https://api.hypixel.net/v2/resources/skyblock/election", HypixelSkyBlockElection],
    ["https://api.hypixel.net/v2/resources/skyblock/items", HypixelSkyBlockItem],
    ["https://api.hypixel.net/v2/resources/skyblock/skills", HypixelSkyBlockSkills],
    ["https://api.hypixel.net/v2/resources/achievements", HypixelAchievements],
    ["https://api.hypixel.net/v2/resources/challenges", HypixelChallenges],
    ["https://api.hypixel.net/v2/resources/games", HypixelGames],
    ["https://api.hypixel.net/v2/resources/guilds/achievements", HypixelGuildAchievements],
    ["https://api.hypixel.net/v2/resources/vanity/pets", HypixelPet],
    ["https://api.hypixel.net/v2/resources/vanity/pets", HypixelPetRarity],
    ["https://api.hypixel.net/v2/resources/vanity/companions", HypixelCompanion],
    ["https://api.hypixel.net/v2/resources/vanity/companions", HypixelCompanionRarity],
    ["https://api.hypixel.net/v2/resources/quests", HypixelQuests],
    ["https://api.hypixel.net/v2/counts", HypixelPlayerCounts],
    ["https://api.hypixel.net/v2/punishmentstats", HypixelPunishmentStatistics],
    ["https://api.hypixel.net/v2/skyblock/auctions", HypixelSkyBlockAuction],
    ["https://api.hypixel.net/v2/skyblock/bazaar", HypixelSkyBlockBazaarProducts],
    ["https://api.hypixel.net/v2/skyblock/firesales", HypixelSkyBlockFireSale],
    ["https://api.hypixel.net/v2/skyblock/news", HypixelSkyBlockNews],
    // Top 3 guilds
    ["https://api.hypixel.net/v2/guild?id=5363aa4eed50df539dca00ad", HypixelGuild],
    ["https://api.hypixel.net/v2/guild?id=53bd67d7ed503e868873eceb", HypixelGuild],
    ["https://api.hypixel.net/v2/guild?id=56ece7c40cf2e4f9ffcc284e", HypixelGuild],

    ...getUrlsForPlayer("f7c77d999f154a66a87dc4a51ef30d19"),
    ...getUrlsForPlayer("b876ec32e396476ba1158438d83c67d4"),
    ...getUrlsForPlayer("869c2a8943b041a8865667a2cc8c7923"),
    ...getUrlsForSkyBlockProfile("d3df3ccc-ffd3-473f-bbba-311d5329bd25")
]

export const allSchemas = [
    HypixelBooster,
    HypixelLeaderboards,
    HypixelSkyBlockEndedAuction,
    HypixelSkyBlockNews,
    HypixelSkyBlockAuction,
    HypixelSkyBlockFireSale,
    HypixelSkyBlockBingoGoal,
    HypixelSkyBlockCollections,
    HypixelSkyBlockMayor,
    HypixelSkyBlockElection,
    HypixelSkyBlockItem,
    HypixelSkyBlockSkills,
    HypixelAchievements,
    HypixelChallenges,
    HypixelGames,
    HypixelGuildAchievements,
    HypixelPet,
    HypixelPetRarity,
    HypixelCompanion,
    HypixelCompanionRarity,
    HypixelQuests,
    HypixelPunishmentStatistics,
    HypixelPlayerCounts,
    HypixelSkyBlockMuseum,
    HypixelSkyBlockBazaarProducts,
    HypixelSkyBlockBingoProfile,
    HypixelStatus,
    HypixelRecentGames,
    HypixelPlayer,
    HypixelGuild,
    HypixelSkyBlockProfile,
]
