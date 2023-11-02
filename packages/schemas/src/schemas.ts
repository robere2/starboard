import {dirname, join} from "path";
import {SchemaData} from "./SchemaData.js";
import {fileURLToPath} from "url";
import {pickRandomLeaderboardPlayers} from "./tools.js";

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

const HypixelBooster: SchemaData = {
    defName: "HypixelBooster",
    schemaPath: join(inDir, 'boosters.json'),
    dtsOutDir: outDir,
    testUrls: ["https://api.hypixel.net/boosters"],
    dataPreprocess: (input) => input.boosters,
    dataPostprocess(input) {
        // TODO - Add booster buyers to player list
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
        playersToScan.push(...pickRandomLeaderboardPlayers(input.responses["https://api.hypixel.net/leaderboards"]));
    }
}

const HypixelPlayer: SchemaData = {
    defName: "HypixelPlayer",
    schemaPath: join(inDir, 'player.json'),
    dtsOutDir: outDir,
    testUrls: playersToScan,
    dataPreprocess: (input) => input.player,
    dataPostprocess: (input) => {
        // TODO - Add players to guild list
    }
}

const HypixelGuild: SchemaData = {
    defName: "HypixelGuild",
    schemaPath: join(inDir, 'guild.json'),
    dtsOutDir: outDir,
    testUrls: guildsToScan,
    dataPreprocess: (input) => input.guild
}

export default {
    HypixelPlayer,
    HypixelGuild,
    HypixelLeaderboard,
    HypixelBooster
}
