import {dirname, join} from "path";
import {SchemaData} from "./SchemaData.js";
import {fileURLToPath} from "url";
import {pickRandom} from "./tools.js";

const __dirname = dirname(fileURLToPath(import.meta.url))

// The URLs we scan are dynamically determined from API responses. For example, for the `player.json` schema, we scan a
// sample of the top players on the leaderboards. In addition to that, we have some starting points for types of data
// which can't be collected from the leaderboards, or which may be edge cases. These are arrays of URLs to be scanned.
const guildsToScan: string[] = [ // Top 3 guilds
    "https://api.hypixel.net/guild?id=5363aa4eed50df539dca00ad",
    "https://api.hypixel.net/guild?id=53bd67d7ed503e868873eceb",
    "https://api.hypixel.net/guild?id=56ece7c40cf2e4f9ffcc284e",
];
const playersToScan: string[] = [
    "https://api.hypixel.net/player?uuid=f7c77d999f154a66a87dc4a51ef30d19", // hypixel
    "https://api.hypixel.net/player?uuid=b876ec32e396476ba1158438d83c67d4", // Technoblade
    "https://api.hypixel.net/player?uuid=869c2a8943b041a8865667a2cc8c7923", // X
];

const inDir = join(__dirname, 'schemas', 'hypixel');
const outDir = join(__dirname, '..', 'dist', 'types');

const HypixelPlayerCounts: SchemaData = {
    defName: "HypixelPlayerCounts",
    schemaPath: join(inDir, 'counts.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/counts"]
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
            playersToScan.push(`https://api.hypixel.net/player?uuid=${uuid}`)
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
            playersToScan.push(`https://api.hypixel.net/player?uuid=${uuid}`)
        });

        pickRandom(allUniqueLeaderboardPlayers, 5).forEach(uuid => {
            guildsToScan.push(`https://api.hypixel.net/guild?player=${uuid}`)
        });
    }
}

const HypixelPlayer: SchemaData = {
    defName: "HypixelPlayer",
    schemaPath: join(inDir, 'player.json'),
    dtsOutDir: outDir,
    testUrls: playersToScan,
    dataPreprocess: (input) => input.player
}

const HypixelGuild: SchemaData = {
    defName: "HypixelGuild",
    schemaPath: join(inDir, 'guild.json'),
    dtsOutDir: outDir,
    testUrls: guildsToScan,
    dataPreprocess: (input) => input.guild
}

export default {
    HypixelPlayerCounts,
    HypixelBooster,
    HypixelLeaderboard,
    HypixelPlayer,
    HypixelGuild,
}
