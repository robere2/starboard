import {getTotalRequests, printBox, processHypixelSchemaChanges} from "./tools.js";
import dotenv from "dotenv";
import Schemas from "./schemas.js";
dotenv.config();

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            HYPIXEL_GEN_API_KEY: string;
        }
    }
}

if(!process.env.HYPIXEL_GEN_API_KEY) {
    throw new Error('Required environment variable "HYPIXEL_GEN_API_KEY" is missing or malformed. Visit https://developer.hypixel.net/dashboard to get one.')
}

// We want to track the number of requests we send out and at what frequency, so we can display them in the
// logs later.
const startTime = Date.now();

// The order of these function calls matters. The API response of different endpoints feeds into the
// list of other URLs to test.

await processHypixelSchemaChanges(Schemas.HypixelBooster)
await processHypixelSchemaChanges(Schemas.HypixelLeaderboards)
await processHypixelSchemaChanges(Schemas.HypixelSkyBlockEndedAuction)
await processHypixelSchemaChanges(Schemas.HypixelSkyBlockProfile)

await processHypixelSchemaChanges(Schemas.HypixelSkyBlockNews)
await processHypixelSchemaChanges(Schemas.HypixelSkyBlockAuction)
await processHypixelSchemaChanges(Schemas.HypixelSkyBlockFireSale)
await processHypixelSchemaChanges(Schemas.HypixelSkyBlockBingoGoal)
await processHypixelSchemaChanges(Schemas.HypixelSkyBlockCollections)
await processHypixelSchemaChanges(Schemas.HypixelSkyBlockMayor)
await processHypixelSchemaChanges(Schemas.HypixelSkyBlockElection)
await processHypixelSchemaChanges(Schemas.HypixelSkyBlockItem)
await processHypixelSchemaChanges(Schemas.HypixelSkyBlockSkills)
await processHypixelSchemaChanges(Schemas.HypixelAchievements)
await processHypixelSchemaChanges(Schemas.HypixelChallenges)
await processHypixelSchemaChanges(Schemas.HypixelGames)
await processHypixelSchemaChanges(Schemas.HypixelGuildAchievements)
await processHypixelSchemaChanges(Schemas.HypixelPet)
await processHypixelSchemaChanges(Schemas.HypixelPetRarity)
await processHypixelSchemaChanges(Schemas.HypixelCompanion)
await processHypixelSchemaChanges(Schemas.HypixelCompanionRarity)
await processHypixelSchemaChanges(Schemas.HypixelQuests)
await processHypixelSchemaChanges(Schemas.HypixelPunishmentStatistics)
await processHypixelSchemaChanges(Schemas.HypixelPlayerCounts)

// These are the schemas that are expected to take a while due to their size/input count
await processHypixelSchemaChanges(Schemas.HypixelSkyBlockMuseum)
await processHypixelSchemaChanges(Schemas.HypixelSkyBlockBazaarProducts)
await processHypixelSchemaChanges(Schemas.HypixelSkyBlockBingoProfile)
await processHypixelSchemaChanges(Schemas.HypixelStatus)
await processHypixelSchemaChanges(Schemas.HypixelRecentGames)
await processHypixelSchemaChanges(Schemas.HypixelPlayer)
await processHypixelSchemaChanges(Schemas.HypixelGuild)

const endTime = Date.now();
const timeTaken = endTime - startTime;

printBox([
    `Generation complete - Took ${Math.floor(timeTaken / 60000)}m ${Math.floor(timeTaken / 1000) % 60}s`,
    `Sent a total of ${getTotalRequests()} requests to the Hypixel API.`
])
