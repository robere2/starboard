import {processHypixelSchemaChanges} from "./tools.js";
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

// The order of these function calls matters. The API response of different endpoints feeds into the
// list of other URLs to test.
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
await processHypixelSchemaChanges(Schemas.HypixelBooster)
await processHypixelSchemaChanges(Schemas.HypixelLeaderboard)
await processHypixelSchemaChanges(Schemas.HypixelStatus)
await processHypixelSchemaChanges(Schemas.HypixelRecentGames)
await processHypixelSchemaChanges(Schemas.HypixelPlayer)
await processHypixelSchemaChanges(Schemas.HypixelGuild)
