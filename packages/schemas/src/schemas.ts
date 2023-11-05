import {dirname, join} from "path";
import {SchemaData} from "./SchemaData.js";
import {fileURLToPath} from "url";
import {pickRandom, processHypixelSchemaChanges} from "./tools.js";

const __dirname = dirname(fileURLToPath(import.meta.url))

// The URLs we scan are dynamically determined from API responses. For example, for the `player.json` schema, we scan a
// sample of the top players on the leaderboards. In addition to that, we have some starting points for types of data
// which can't be collected from the leaderboards, or which may be edge cases. These are arrays of URLs to be scanned.
const guildUrlsToScan: string[] = [ // Top 3 guilds
    "https://api.hypixel.net/guild?id=5363aa4eed50df539dca00ad",
    "https://api.hypixel.net/guild?id=53bd67d7ed503e868873eceb",
    "https://api.hypixel.net/guild?id=56ece7c40cf2e4f9ffcc284e",
];
const playersToScan: string[] = [
    "f7c77d999f154a66a87dc4a51ef30d19", // hypixel
    "b876ec32e396476ba1158438d83c67d4", // Technoblade
    "869c2a8943b041a8865667a2cc8c7923", // X
];

const skyblockProfilesToScan: string[] = [
    "d3df3ccc-ffd3-473f-bbba-311d5329bd25"
];

const inDir = join(__dirname, 'schemas', 'hypixel');
const outDir = join(__dirname, '..', 'dist', 'types');

export const HypixelSkyBlockBingoGoal: SchemaData = {
    defName: "HypixelSkyBlockBingoGoal",
    schemaPath: join(inDir, 'resources', 'skyblock', 'bingo.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/skyblock/bingo"],
    dataPreprocess: (input) => input.goals,
}

export const HypixelSkyBlockCollections: SchemaData = {
    defName: "HypixelSkyBlockCollections",
    schemaPath: join(inDir, 'resources', 'skyblock', 'collections.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/skyblock/collections"],
    dataPreprocess: (input) => input.collections,
}

export const HypixelSkyBlockMayor: SchemaData = {
    defName: "HypixelSkyBlockMayor",
    schemaPath: join(inDir, 'resources', 'skyblock', 'election.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/skyblock/election"],
    dataPreprocess: (input) => input.mayor,
}

export const HypixelSkyBlockElection: SchemaData = {
    defName: "HypixelSkyBlockElection",
    schemaPath: join(inDir, 'resources', 'skyblock', 'election.json'),
    testUrls: ["https://api.hypixel.net/resources/skyblock/election"],
    dataPreprocess: (input) => input.current,
}

export const HypixelSkyBlockItem: SchemaData = {
    defName: "HypixelSkyBlockItem",
    schemaPath: join(inDir, 'resources', 'skyblock', 'items.json'),
    testUrls: ["https://api.hypixel.net/resources/skyblock/items"],
    dataPreprocess: (input) => input.items,
}

export const HypixelSkyBlockSkills: SchemaData = {
    defName: "HypixelSkyBlockSkills",
    schemaPath: join(inDir, 'resources', 'skyblock', 'skills.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/skyblock/skills"],
    dataPreprocess: (input) => input.collections,
}

export const HypixelAchievements: SchemaData = {
    defName: "HypixelAchievements",
    schemaPath: join(inDir, 'resources', 'achievements.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/achievements"],
    dataPreprocess: (input) => input.achievements,
}

export const HypixelChallenges: SchemaData = {
    defName: "HypixelChallenges",
    schemaPath: join(inDir, 'resources', 'challenges.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/challenges"],
    dataPreprocess: (input) => input.challenges
}

export const HypixelGames: SchemaData = {
    defName: "HypixelGames",
    schemaPath: join(inDir, 'resources', 'games.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/games"],
    dataPreprocess: (input) => input.games
}

export const HypixelGuildAchievements: SchemaData = {
    defName: "HypixelGuildAchievements",
    schemaPath: join(inDir, 'resources', 'guilds', 'achievements.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/guilds/achievements"]
}

export const HypixelPet: SchemaData = {
    defName: "HypixelPet",
    schemaPath: join(inDir, 'resources', 'vanity', 'pets.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/vanity/pets"],
    dataPreprocess: (input) => input.types
}

export const HypixelPetRarity: SchemaData = {
    defName: "HypixelPetRarity",
    schemaPath: join(inDir, 'resources', 'vanity', 'pets.json'),
    testUrls: ["https://api.hypixel.net/resources/vanity/pets"],
    dataPreprocess: (input) => input.rarities
}

export const HypixelCompanion: SchemaData = {
    defName: "HypixelCompanion",
    schemaPath: join(inDir, 'resources', 'vanity', 'companions.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/vanity/companions"],
    dataPreprocess: (input) => input.types
}

export const HypixelCompanionRarity: SchemaData = {
    defName: "HypixelCompanionRarity",
    schemaPath: join(inDir, 'resources', 'vanity', 'companions.json'),
    testUrls: ["https://api.hypixel.net/resources/vanity/companions"],
    dataPreprocess: (input) => input.rarities
}

export const HypixelQuests: SchemaData = {
    defName: "HypixelQuests",
    schemaPath: join(inDir, 'resources', 'quests.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/quests"],
    dataPreprocess: (input) => input.quests
}

export const HypixelPlayerCounts: SchemaData = {
    defName: "HypixelPlayerCounts",
    schemaPath: join(inDir, 'counts.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/counts"]
}

export const HypixelPunishmentStatistics: SchemaData = {
    defName: "HypixelPunishmentStatistics",
    schemaPath: join(inDir, 'punishmentstats.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/punishmentstats"]
}

export const HypixelStatus: SchemaData = {
    defName: "HypixelStatus",
    schemaPath: join(inDir, 'status.json'),
    dtsOutDir: outDir,
    testUrls: () => playersToScan.map(uuid => `https://api.hypixel.net/status?uuid=${uuid}`),
    dataPreprocess: (input) => input.session,
}

export const HypixelRecentGames: SchemaData = {
    defName: "HypixelRecentGame",
    schemaPath: join(inDir, 'recentgames.json'),
    dtsOutDir: outDir,
    testUrls: () => playersToScan.map(uuid => `https://api.hypixel.net/recentgames?uuid=${uuid}`),
    dataPreprocess: (input) => input.games,
}

export const HypixelBooster: SchemaData = {
    defName: "HypixelBooster",
    schemaPath: join(inDir, 'boosters.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/boosters"],
    dataPreprocess: (input) => input.boosters,
    dataPostprocess(input) {
        // There's only one value, so this is shorthand for accessing the value directly by its URL
        const body = Object.values(input.responses)[0]

        // Flatten all leaderboards down into an array containing just player UUIDs, then pass to the Set constructor to
        // remove duplicates. Spread back into array so we can get values at an index.
        const allUniqueBoosterPurchasers = [
            ...new Set<string>(body.boosters?.map((b: any) => b.purchaserUuid) ?? [])
        ]

        pickRandom(allUniqueBoosterPurchasers, 10).forEach(uuid => {
            if(!uuid) return;
            playersToScan.push(uuid)
        });
    }
}

export const HypixelLeaderboards: SchemaData = {
    defName: "HypixelLeaderboards",
    schemaPath: join(inDir, 'leaderboards.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/leaderboards"],
    dataPreprocess: (input) => input.leaderboards,
    dataPostprocess: (input) => {
        // Pick random players from the leaderboards to feed into other schema checks
        // There's only one value, so this is shorthand for accessing the value directly by its URL
        const body = Object.values(input.responses)[0]

        // Flatten all leaderboards down into an array containing just player UUIDs, then pass to the Set constructor to
        // remove duplicates. Spread back into array so we can get values at an index.
        const allUniqueLeaderboardPlayers = [
            ...new Set<string>(
                Object.values(body.leaderboards)
                    .flat()
                    .map(v => (v as any).leaders ?? [])
                    .flat()
            )
        ]

        pickRandom(allUniqueLeaderboardPlayers, 20).forEach(uuid => {
            if(!uuid) return;
            playersToScan.push(uuid)
        });

        pickRandom(allUniqueLeaderboardPlayers, 5).forEach(uuid => {
            if(!uuid) return;
            guildUrlsToScan.push(`https://api.hypixel.net/guild?player=${uuid}`)
        });
    }
}

export const HypixelPlayer: SchemaData = {
    defName: "HypixelPlayer",
    schemaPath: join(inDir, 'player.json'),
    dtsOutDir: outDir,
    testUrls: () => playersToScan.map(uuid => `https://api.hypixel.net/player?uuid=${uuid}`),
    dataPreprocess: (input) => input.player,
    dataPostprocess: (input) => {
        // Go through our list of players and add a random one of their SkyBlock profiles to be scanned.
        // Adds a maximum of 15 profiles
        const responseArray = Object.values(input.responses);
        const startingProfileCount = skyblockProfilesToScan.length;
        const maxProfilesToAdd = 15;
        for(const response of responseArray) {
            const playerProfiles = Object.values(response.player?.stats?.SkyBlock?.profiles ?? {});
            const randomProfile = pickRandom(playerProfiles, 1);
            if(!randomProfile || !(randomProfile as any).profile_id) {
                continue;
            }
            skyblockProfilesToScan.push((randomProfile as any).profile_id)
            if(skyblockProfilesToScan.length - maxProfilesToAdd >= startingProfileCount) {
                break;
            }
        }
    }
}

export const HypixelGuild: SchemaData = {
    defName: "HypixelGuild",
    schemaPath: join(inDir, 'guild.json'),
    dtsOutDir: outDir,
    testUrls: guildUrlsToScan,
    dataPreprocess: (input) => input.guild
}

export const HypixelSkyBlockAuction: SchemaData = {
    defName: "HypixelSkyBlockAuction",
    schemaPath: join(inDir, 'skyblock', 'auctions.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/skyblock/auctions"],
    dataPreprocess: (input) => input.auctions
}

export const HypixelSkyBlockEndedAuction: SchemaData = {
    defName: "HypixelSkyBlockEndedAuction",
    schemaPath: join(inDir, 'skyblock', 'auctions_ended.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/skyblock/auctions_ended"],
    dataPreprocess: (input) => input.auctions,
    dataPostprocess: (input) => {
        // There's only one value, so this is shorthand for accessing the value directly by its URL
        const body = Object.values(input.responses)[0];

        // Flatten all leaderboards down into an array containing just player UUIDs, then pass to the Set constructor to
        // remove duplicates. Spread back into array so we can get values at an index.
        const allUniqueProfiles = [
            ...new Set<string>(
                body.auctions?.map((auction: any) => auction.seller_profile)
            )
        ]
        const allUniquePlayers = [
            ...new Set<string>(
                body.auctions?.map((auction: any) => [auction.seller, auction.buyer]).flat()
            )
        ]

        pickRandom(allUniqueProfiles, 25).forEach(uuid => {
            if(!uuid) return;
            skyblockProfilesToScan.push(uuid)
        });
        pickRandom(allUniquePlayers, 15).forEach(uuid => {
            if(!uuid) return;
            playersToScan.push(uuid)
        });
    }
}

export const HypixelSkyBlockBazaarProducts: SchemaData = {
    defName: "HypixelSkyBlockBazaarProducts",
    schemaPath: join(inDir, 'skyblock', 'bazaar.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/skyblock/bazaar"],
    dataPreprocess: (input) => input.products
}

export const HypixelSkyBlockBingoProfile: SchemaData = {
    defName: "HypixelSkyBlockBingoProfile",
    schemaPath: join(inDir, 'skyblock', 'bingo.json'),
    dtsOutDir: outDir,
    testUrls: () => playersToScan.map(uuid => `https://api.hypixel.net/skyblock/bingo?uuid=${uuid}`),
    dataPreprocess: (input) => input.events
}

export const HypixelSkyBlockFireSale: SchemaData = {
    defName: "HypixelSkyBlockFireSale",
    schemaPath: join(inDir, 'skyblock', 'firesales.json'),
    dtsOutDir: outDir,
    testUrls: () => ["https://api.hypixel.net/skyblock/firesales"],
    dataPreprocess: (input) => input.sales
}

export const HypixelSkyBlockMuseum: SchemaData = {
    defName: "HypixelSkyBlockMuseum",
    schemaPath: join(inDir, 'skyblock', 'museum.json'),
    dtsOutDir: outDir,
    testUrls: () => skyblockProfilesToScan.map(id => `https://api.hypixel.net/skyblock/museum?profile=${id}`),
    dataPreprocess: (input) => Object.values(input.members)
}

export const HypixelSkyBlockNews: SchemaData = {
    defName: "HypixelSkyBlockNews",
    schemaPath: join(inDir, 'skyblock', 'news.json'),
    dtsOutDir: outDir,
    testUrls: () => ["https://api.hypixel.net/skyblock/news"],
    dataPreprocess: (input) => input.items
}

export const HypixelSkyBlockProfile: SchemaData = {
    defName: "HypixelSkyBlockProfile",
    schemaPath: join(inDir, 'skyblock', 'profile.json'),
    dtsOutDir: outDir,
    testUrls: () => skyblockProfilesToScan.map(id => `https://api.hypixel.net/skyblock/profile?profile=${id}`),
    dataPreprocess: (input) => input.profile
}

export const orderedSchemas = [
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
