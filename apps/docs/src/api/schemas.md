<script setup>
import ApiRefLink from "../components/ApiRefLink.vue"
</script>

# Schemas

Both <ApiRefLink name="HypixelAPI" /> and <ApiRefLink name="MojangAPI" /> use [`zod`](https://zod.dev/) to parse their JSON
responses. This is what powers our automatic type generation, and gives us great type inference. However, the inferred 
`zod` types can grow quite large. Due to their size, we don't include them in the [generated reference](reference/). If 
you need to see the definition of schema responses, it is pretty easy to read them directly from the source code.

## General
- [HypixelBooster](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/BoosterSchema.ts)
- [HypixelGuild](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/GuildSchema.ts)
- [HypixelLeaderboard](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/LeaderboardsSchema.ts)
- [HypixelLeaderboards](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/LeaderboardsSchema.ts)
- [HypixelPlayerCounts](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/PlayerCountsSchema.ts)
- [HypixelGamePlayerCount](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/PlayerCountsSchema.ts)
- [HypixelPlayer](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/PlayerSchema.ts)
- [HypixelPunishmentStatistics](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/PunishmentStatisticsSchema.ts)
- [HypixelRecentGame](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/RecentGamesSchema.ts)
- [HypixelStatus](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/StatusSchema.ts)
- [HypixelSession](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/StatusSchema.ts)

### Resources

- [HypixelGameAchievements](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/AchievementsResourceSchema.ts)
- [HypixelTieredAchievement](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/AchievementsResourceSchema.ts)
- [HypixelOneTimeAchievement](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/AchievementsResourceSchema.ts)
- [HypixelChallenge](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/ChallengesResourceSchema.ts)
- [HypixelGame](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/GamesResourceSchema.ts)
- [HypixelGuildAchievements](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/GuildAchievementsResourceSchema.ts)
- [HypixelTieredGuildAchievement](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/GuildAchievementsResourceSchema.ts)
- [HypixelOneTimeGuildAchievement](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/GuildAchievementsResourceSchema.ts)
- [HypixelPet](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/PetsResourceSchema.ts)
- [HypixelRarity](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/PetsResourceSchema.ts)
- [HypixelQuest](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/QuestsResourceSchema.ts)

## SkyBlock

- [HypixelSkyBlockAuctions](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/skyblock/SkyBlockAuctionSchema.ts)
- [HypixelSkyBlockAuction](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/skyblock/SkyBlockAuctionSchema.ts)
- [HypixelSkyBlockEndedAuction](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/skyblock/SkyBlockAuctionSchema.ts)
- [HypixelSkyBlockBingoProfile](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/skyblock/SkyBlockBingoSchema.ts)
- [HypixelSkyBlockFiresale](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/skyblock/SkyBlockFiresalesSchema.ts)
- [HypixelSkyBlockMuseum](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/skyblock/SkyBlockMuseumSchema.ts)
- [HypixelSkyBlockNews](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/skyblock/SkyBlockNewsSchema.ts)
- [HypixelSkyBlockProfile](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/skyblock/SkyBlockProfileSchema.ts)

### Resources

- [HypixelSkyBlockBingo](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/skyblock/SkyBlockBingoResourceSchema.ts)
- [HypixelSkyBlockCollection](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/skyblock/SkyBlockCollectionsResourceSchema.ts)
- [HypixelSkyBlockMayor](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/skyblock/SkyBlockElectionResourceSchema.ts)
- [HypixelSkyBlockMayorCandidate](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/skyblock/SkyBlockElectionResourceSchema.ts)
- [HypixelSkyBlockElection](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/skyblock/SkyBlockElectionResourceSchema.ts)
- [HypixelSkyBlockItem](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/skyblock/SkyBlockItemsResourceSchema.ts)
- [HypixelSkyBlockSkill](https://github.com/robere2/starboard/blob/master/packages/api/src/schemas/resources/skyblock/SkyBlockSkillsResourceSchema.ts)

