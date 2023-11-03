import {dirname, join} from "path";
import {SchemaData} from "./SchemaData.js";
import {fileURLToPath} from "url";
import {pickRandom} from "./tools.js";

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

const inDir = join(__dirname, 'schemas', 'hypixel');
const outDir = join(__dirname, '..', 'dist', 'types');

const HypixelAchievements: SchemaData = {
    defName: "HypixelAchievements",
    schemaPath: join(inDir, 'resources', 'achievements.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/achievements"],
    dataPreprocess: (input) => input.achievements,
}

const HypixelChallenges: SchemaData = {
    defName: "HypixelChallenges",
    schemaPath: join(inDir, 'resources', 'challenges.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/challenges"],
    dataPreprocess: (input) => input.challenges
}

const HypixelGames: SchemaData = {
    defName: "HypixelGames",
    schemaPath: join(inDir, 'resources', 'games.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/games"],
    dataPreprocess: (input) => input.games
}

const HypixelGuildAchievements: SchemaData = {
    defName: "HypixelGuildAchievements",
    schemaPath: join(inDir, 'resources', 'guilds', 'achievements.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/guilds/achievements"]
}

const HypixelPet: SchemaData = {
    defName: "HypixelPet",
    schemaPath: join(inDir, 'resources', 'vanity', 'pets.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/vanity/pets"],
    dataPreprocess: (input) => input.types
}

const HypixelPetRarity: SchemaData = {
    defName: "HypixelPetRarity",
    schemaPath: join(inDir, 'resources', 'vanity', 'pets.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/vanity/pets"],
    dataPreprocess: (input) => input.rarities
}

const HypixelCompanion: SchemaData = {
    defName: "HypixelCompanion",
    schemaPath: join(inDir, 'resources', 'vanity', 'companions.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/vanity/companions"],
    dataPreprocess: (input) => input.types
}

const HypixelCompanionRarity: SchemaData = {
    defName: "HypixelCompanionRarity",
    schemaPath: join(inDir, 'resources', 'vanity', 'companions.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/vanity/companions"],
    dataPreprocess: (input) => input.rarities
}

const HypixelQuests: SchemaData = {
    defName: "HypixelQuests",
    schemaPath: join(inDir, 'resources', 'quests.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/resources/quests"],
    dataPreprocess: (input) => input.quests
}

const HypixelPlayerCounts: SchemaData = {
    defName: "HypixelPlayerCounts",
    schemaPath: join(inDir, 'counts.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/counts"]
}

const HypixelPunishmentStatistics: SchemaData = {
    defName: "HypixelPunishmentStatistics",
    schemaPath: join(inDir, 'punishmentstats.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/punishmentstats"]
}

const HypixelStatus: SchemaData = {
    defName: "HypixelStatus",
    schemaPath: join(inDir, 'status.json'),
    dtsOutDir: outDir,
    testUrls: () => playersToScan.map(uuid => `https://api.hypixel.net/status?uuid=${uuid}`),
    dataPreprocess: (input) => input.session,
}

const HypixelRecentGames: SchemaData = {
    defName: "HypixelRecentGame",
    schemaPath: join(inDir, 'recentgames.json'),
    dtsOutDir: outDir,
    testUrls: () => playersToScan.map(uuid => `https://api.hypixel.net/recentgames?uuid=${uuid}`),
    dataPreprocess: (input) => input.games,
}

const HypixelBooster: SchemaData = {
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
            playersToScan.push(uuid)
        });
    }
}

const HypixelLeaderboard: SchemaData = {
    defName: "HypixelLeaderboard",
    schemaPath: join(inDir, 'leaderboards.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/leaderboards"],
    dataPreprocess: (input) => {
        return Object.values(input.leaderboards).flat()
    },
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

        pickRandom(allUniqueLeaderboardPlayers, 25).forEach(uuid => {
            playersToScan.push(uuid)
        });

        pickRandom(allUniqueLeaderboardPlayers, 5).forEach(uuid => {
            guildUrlsToScan.push(`https://api.hypixel.net/guild?player=${uuid}`)
        });
    }
}

const HypixelPlayer: SchemaData = {
    defName: "HypixelPlayer",
    schemaPath: join(inDir, 'player.json'),
    dtsOutDir: outDir,
    testUrls: () => playersToScan.map(uuid => `https://api.hypixel.net/player?uuid=${uuid}`),
    dataPreprocess: (input) => input.player
}

const HypixelGuild: SchemaData = {
    defName: "HypixelGuild",
    schemaPath: join(inDir, 'guild.json'),
    dtsOutDir: outDir,
    testUrls: guildUrlsToScan,
    dataPreprocess: (input) => input.guild
}

export default {
    HypixelAchievements,
    HypixelChallenges,
    HypixelGames,
    HypixelGuildAchievements,
    HypixelPet,
    HypixelPetRarity,
    HypixelCompanion,
    HypixelCompanionRarity,
    HypixelQuests,
    HypixelPlayerCounts,
    HypixelPunishmentStatistics,
    HypixelStatus,
    HypixelRecentGames,
    HypixelBooster,
    HypixelLeaderboard,
    HypixelPlayer,
    HypixelGuild,
}
