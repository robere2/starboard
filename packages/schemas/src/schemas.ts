import {dirname, join} from "path";
import {fileURLToPath} from "url";
import {pickRandom} from "./util.js";
import {FileSchemaContainer, FileSchemaContainerOptions} from "./classes/FileSchemaContainer";
import {AddUrlCallback} from "./classes/SchemaContainer";

const __dirname = dirname(fileURLToPath(import.meta.url))
const inDir = join(__dirname, 'schemas', 'hypixel');
const ajvOptions = {
    allErrors: true,
    inlineRefs: false
};


export async function loadAllSchemas(addUrlCallback?: AddUrlCallback): Promise<FileSchemaContainer[]> {
    const defaultOptions: Omit<FileSchemaContainerOptions, "path"> = {
        ajvOptions,
        addUrlCallback
    }
    const HypixelSkyBlockBingoGoal = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'resources', 'skyblock', 'bingo.json')
    });
    const HypixelSkyBlockCollections = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'resources', 'skyblock', 'collections.json')
    });
    const HypixelSkyBlockElection = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'resources', 'skyblock', 'election.json')
    });
    const HypixelSkyBlockItems = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'resources', 'skyblock', 'items.json')
    });
    const HypixelSkyBlockSkills = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'resources', 'skyblock', 'skills.json')
    });
    const HypixelAchievements = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'resources', 'achievements.json')
    });
    const HypixelChallenges = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'resources', 'challenges.json')
    });
    const HypixelGames = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'resources', 'games.json')
    });
    const HypixelGuildAchievements = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'resources', 'guilds', 'achievements.json')
    });
    const HypixelPets = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'resources', 'vanity', 'pets.json')
    });
    const HypixelCompanions = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'resources', 'vanity', 'companions.json')
    });
    const HypixelQuests = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'resources', 'quests.json')
    });
    const HypixelPlayerCounts = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'counts.json')
    });
    const HypixelPunishmentStatistics = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'punishmentstats.json')
    });
    const HypixelStatus = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'status.json')
    });
    const HypixelRecentGames = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'recentgames.json')
    });
    const HypixelBooster = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'boosters.json')
    });
    const HypixelLeaderboards = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'leaderboards.json')
    });
    const HypixelPlayer = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'player.json')
    });
    const HypixelGuild = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'guild.json')
    });
    const HypixelSkyBlockAuction = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'skyblock', 'auctions.json')
    });
    const HypixelSkyBlockEndedAuction = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'skyblock', 'auctions_ended.json')
    });
    const HypixelSkyBlockBazaarProducts = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'skyblock', 'bazaar.json')
    });
    const HypixelSkyBlockBingoProfile = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'skyblock', 'bingo.json')
    });
    const HypixelSkyBlockFireSale = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'skyblock', 'firesales.json')
    });
    const HypixelSkyBlockMuseum = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'skyblock', 'museum.json')
    });
    const HypixelSkyBlockNews = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'skyblock', 'news.json')
    });
    const HypixelSkyBlockProfile = await FileSchemaContainer.create({
        ...defaultOptions,
        path: join(inDir, 'skyblock', 'profile.json')
    });

    HypixelBooster.transform((response) => {
        // Flatten all leaderboards down into an array containing just player UUIDs, then pass to the Set constructor to
        // remove duplicates. Spread back into array so we can get values at an index.
        const allUniqueBoosterPurchasers = [
            ...new Set<string>(response.boosters?.map((b: any) => b.purchaserUuid) ?? [])
        ].filter(uuid => !!uuid)

        pickRandom(allUniqueBoosterPurchasers, 10).forEach(uuid => {
            addUrlsForPlayer(uuid)
        });
    })

    HypixelLeaderboards.transform((response) => {
        // Flatten all leaderboards down into an array containing just player UUIDs, then pass to the Set constructor to
        // remove duplicates. Spread back into array so we can get values at an index.
        const allUniqueLeaderboardPlayers = [
            ...new Set<string>(
                Object.values(response.leaderboards ?? {})
                    .flat()
                    .map(v => (v as any).leaders ?? [])
                    .flat()
            )
        ].filter(uuid => !!uuid)

        pickRandom(allUniqueLeaderboardPlayers, 20).forEach(uuid => {
            addUrlsForPlayer(uuid);
        });

        pickRandom(allUniqueLeaderboardPlayers, 5).forEach(uuid => {
            HypixelGuild.addUrl(`https://api.hypixel.net/v2/guild?player=${uuid}`)
        });
    })

    let sbProfilesAdded = 0;
    const maxSbProfilesToAdd = 15;
    HypixelPlayer.transform((response) => {
        if(sbProfilesAdded < maxSbProfilesToAdd) {
            sbProfilesAdded++;
            const playerProfiles = Object.values(response.player?.stats?.SkyBlock?.profiles ?? {});
            const randomProfile = pickRandom(playerProfiles, 1);
            if(randomProfile && (randomProfile as any).profile_id) {
                addUrlsForSkyBlockProfile((randomProfile as any).profile_id)
            }
        }
    })

    HypixelSkyBlockEndedAuction.transform((response) => {
        // Flatten all leaderboards down into an array containing just player UUIDs, then pass to the Set constructor to
        // remove duplicates. Spread back into array so we can get values at an index.
        const allUniqueProfiles = [
            ...new Set<string>(
                response.auctions?.map((auction: any) => auction.seller_profile)
            )
        ].filter(uuid => !!uuid)
        const allUniquePlayers = [
            ...new Set<string>(
                response.auctions?.map((auction: any) => [auction.seller, auction.buyer]).flat()
            )
        ].filter(uuid => !!uuid)

        pickRandom(allUniqueProfiles, 25).forEach(id => {
            addUrlsForSkyBlockProfile(id)
        });
        pickRandom(allUniquePlayers, 15).forEach(uuid => {
            addUrlsForPlayer(uuid)
        });
    })

    function addUrlsForSkyBlockProfile(id: string): void {
        HypixelSkyBlockMuseum.addUrl(`https://api.hypixel.net/v2/skyblock/museum?profile=${id}`)
        HypixelSkyBlockProfile.addUrl(`https://api.hypixel.net/v2/skyblock/profile?profile=${id}`)

    }
    function addUrlsForPlayer(uuid: string): void {
        HypixelStatus.addUrl(`https://api.hypixel.net/v2/status?uuid=${uuid}`)
        HypixelRecentGames.addUrl(`https://api.hypixel.net/v2/recentgames?uuid=${uuid}`)
        HypixelPlayer.addUrl(`https://api.hypixel.net/v2/player?uuid=${uuid}`)
        HypixelSkyBlockBingoProfile.addUrl(`https://api.hypixel.net/v2/skyblock/bingo?uuid=${uuid}`)
    }


    HypixelBooster.addUrl("https://api.hypixel.net/v2/boosters");
    HypixelLeaderboards.addUrl("https://api.hypixel.net/v2/leaderboards");
    HypixelSkyBlockEndedAuction.addUrl("https://api.hypixel.net/v2/skyblock/auctions_ended");
    HypixelSkyBlockBingoGoal.addUrl("https://api.hypixel.net/v2/resources/skyblock/bingo");
    HypixelSkyBlockCollections.addUrl("https://api.hypixel.net/v2/resources/skyblock/collections");
    HypixelSkyBlockElection.addUrl("https://api.hypixel.net/v2/resources/skyblock/election");
    HypixelSkyBlockItems.addUrl("https://api.hypixel.net/v2/resources/skyblock/items");
    HypixelSkyBlockSkills.addUrl("https://api.hypixel.net/v2/resources/skyblock/skills");
    HypixelAchievements.addUrl("https://api.hypixel.net/v2/resources/achievements");
    HypixelChallenges.addUrl("https://api.hypixel.net/v2/resources/challenges");
    HypixelGames.addUrl("https://api.hypixel.net/v2/resources/games");
    HypixelGuildAchievements.addUrl("https://api.hypixel.net/v2/resources/guilds/achievements");
    HypixelPets.addUrl("https://api.hypixel.net/v2/resources/vanity/pets");
    HypixelCompanions.addUrl("https://api.hypixel.net/v2/resources/vanity/companions");
    HypixelQuests.addUrl("https://api.hypixel.net/v2/resources/quests");
    HypixelPlayerCounts.addUrl("https://api.hypixel.net/v2/counts");
    HypixelPunishmentStatistics.addUrl("https://api.hypixel.net/v2/punishmentstats");
    HypixelSkyBlockAuction.addUrl("https://api.hypixel.net/v2/skyblock/auctions");
    HypixelSkyBlockBazaarProducts.addUrl("https://api.hypixel.net/v2/skyblock/bazaar");
    HypixelSkyBlockFireSale.addUrl("https://api.hypixel.net/v2/skyblock/firesales");
    HypixelSkyBlockNews.addUrl("https://api.hypixel.net/v2/skyblock/news");
    // Top 3 guilds
    HypixelGuild.addUrl("https://api.hypixel.net/v2/guild?id=5363aa4eed50df539dca00ad");
    HypixelGuild.addUrl("https://api.hypixel.net/v2/guild?id=53bd67d7ed503e868873eceb");
    HypixelGuild.addUrl("https://api.hypixel.net/v2/guild?id=56ece7c40cf2e4f9ffcc284e");

    addUrlsForPlayer("f7c77d999f154a66a87dc4a51ef30d19"),
        addUrlsForPlayer("b876ec32e396476ba1158438d83c67d4"),
        addUrlsForPlayer("869c2a8943b041a8865667a2cc8c7923"),
        addUrlsForSkyBlockProfile("d3df3ccc-ffd3-473f-bbba-311d5329bd25")

    return [
        HypixelBooster,
        HypixelLeaderboards,
        HypixelSkyBlockEndedAuction,
        HypixelSkyBlockNews,
        HypixelSkyBlockAuction,
        HypixelSkyBlockFireSale,
        HypixelSkyBlockBingoGoal,
        HypixelSkyBlockCollections,
        HypixelSkyBlockElection,
        HypixelSkyBlockItems,
        HypixelSkyBlockSkills,
        HypixelAchievements,
        HypixelChallenges,
        HypixelGames,
        HypixelGuildAchievements,
        HypixelPets,
        HypixelCompanions,
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
}
