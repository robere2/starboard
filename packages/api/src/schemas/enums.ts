import * as z from "zod";

export const ZodEnumHypixelGuildAchievements = z.enum([
    "EXPERIENCE_KINGS",
    "WINNERS",
    "ONLINE_PLAYERS"
])

/**
 * Enumerable object containing all the currently-known guild achievement keys.
 *
 * @example
 * const guild = await hypixel.getGuild("b876ec32-e396-476b-a115-8438d83c67d4")
 * const onlinePlayersValue = guild?.achievements.ONLINE_PLAYERS ?? 0
 * // same as
 * const onlinePlayersValue = guild?.achievements[EnumHypixelGuildAchievements.ONLINE_PLAYERS] ?? 0
 * @see {@link HypixelGuild}
 */
export const EnumHypixelGuildAchievements = ZodEnumHypixelGuildAchievements.enum;

export const ZodEnumHypixelGames = z.enum([
    'QUAKECRAFT',
    'SKYCLASH',
    'BUILD_BATTLE',
    'UHC',
    'LEGACY',
    'SKYBLOCK',
    'HOUSING',
    'MCGO',
    'WOOL_GAMES',
    'SURVIVAL_GAMES',
    'BATTLEGROUND',
    'MURDER_MYSTERY',
    'ARCADE',
    'ARENA',
    'TNTGAMES',
    'WALLS',
    'SKYWARS',
    'VAMPIREZ',
    'PROTOTYPE',
    'WALLS3',
    'BEDWARS',
    'PAINTBALL',
    'SUPER_SMASH',
    'SMP',
    'REPLAY',
    'TRUE_COMBAT',
    'PIT',
    'SPEED_UHC',
    'DUELS',
    'GINGERBREAD'
]);

/**
 * Enumerable object containing all the currently-known game types available in the Hypixel API. Specifically, this
 *   enum mirrors the "Type Name" column {@link https://api.hypixel.net/#section/Introduction/GameTypes|found on the
 *   official Hypixel API documentation}. It is also used as the key in the value {@link HypixelResources.games}.
 *
 * @example
 * const bedwarsModes = hypixel.getResources().games.BEDWARS.modeNames
 * // same as
 * const bedwarsModes = hypixel.getResources().games[EnumHypixelGames.BEDWARS].modeNames
 * @see {@link HypixelGame}
 */
export const EnumHypixelGames = ZodEnumHypixelGames.enum;

export const ZodEnumHypixelSkyBlockDungeonClasses = z.enum([
    "healer",
    "archer",
    "mage",
    "tank",
    "berserk"
])

/**
 * Enumerable object containing all the currently-known classes available in SkyBlock dungeons. Each value is all
 * lowercase.
 *
 * @example
 * const profile = await hypixel.getSkyBlockProfile("b876ec32-e396-476b-a115-8438d83c67d4")
 * const dungeons = profile?.members["b876ec32-e396-476b-a115-8438d83c67d4"]?.dungeons;
 *
 * const healerExp = dungeons?.player_classes?.healer?.experience ?? 0;
 * // same as
 * const healerExp = dungeons?.player_classes?.[EnumHypixelSkyBlockDungeonClasses.healer]?.experience ?? 0;
 *
 * console.log(`Player has ${healerExp} experience in the healer class.`);
 * @see {@link HypixelSkyBlockProfile}
 */
export const EnumHypixelSkyBlockDungeonClasses = ZodEnumHypixelSkyBlockDungeonClasses.enum;

export const ZodEnumHypixelPlayerCounts = z.enum([
    ...ZodEnumHypixelGames.options,
    "MAIN_LOBBY",
    "TOURNAMENT_LOBBY",
    "LIMBO",
    "IDLE",
    "QUEUE"
])

/**
 * Enumerable object containing all the currently-known "game types" that are listed in the player counts from the
 *   Hypixel API endpoint `/counts`. Each game type is formatted in CAMEL_CASE.
 *
 * @example
 * const playerCounts = await hypixel.getPlayerCounts()
 * const bedwarsPlayerCount = playerCounts.BEDWARS?.players
 * // same as
 * const bedwarsPlayerCount = playerCounts[EnumHypixelPlayerCounts.BEDWARS]?.players
 * @see {@link HypixelPlayer}
 */
export const EnumHypixelPlayerCounts = ZodEnumHypixelPlayerCounts.enum;

export const ZodEnumHypixelPetConsumables = z.enum([
    "CARROT_ITEM",
    "BAKED_POTATO",
    "FEATHER",
    "ROTTEN_FLESH",
    "SLIME_BALL",
    "COOKED_BEEF",
    "RAW_FISH",
    "WATER_BUCKET",
    "WOOD_SWORD",
    "MILK_BUCKET",
    "GOLD_RECORD",
    "PORK",
    "PUMPKIN_PIE",
    "LEASH",
    "LAVA_BUCKET",
    "MAGMA_CREAM",
    "WHEAT",
    "HAY_BLOCK",
    "BREAD",
    "RED_ROSE",
    "STICK",
    "BONE",
    "APPLE",
    "MUSHROOM_SOUP",
    "COOKIE",
    "CAKE",
    "MELON"
])

/**
 * Enumerable object containing all the currently-known types of food that is available for lobby pets to eat. Each
 *   value is a CAMEL_CASE representation of the item name.
 * @example
 * const player = await hypixel.getPlayer("b876ec32-e396-476b-a115-8438d83c67d4")
 * const slimeBallsRemaining = player?.petConsumables?.SLIME_BALL
 * // same as
 * const slimeBallsRemaining = player?.petConsumables?.[EnumHypixelPetConsumables.SLIME_BALL]
 * @see {@link HypixelPlayer}
 */
export const EnumHypixelPetConsumables = ZodEnumHypixelPetConsumables.enum;

export const ZodEnumMinecraftFireworkShapes = z.enum([
    "BURST",
    "STAR",
    "BALL_LARGE",
    "BALL",
    "CREEPER"
]);

/**
 * Enumerable object containing all the currently-known firework shapes available in the lobby fireworks customizer. Each
 *   value is a CAMEL_CASE representation of the item name.
 * @example
 * const player = await hypixel.getPlayer("b876ec32-e396-476b-a115-8438d83c67d4")
 * const playerFireworks = player?.fireworkStorage ?? [];
 *
 * for(const firework of playerFireworks) {
 *    if(firework.shape === EnumMinecraftFireworkShapes.CREEPER) {
 *        console.log("Sssssssss...")
 *    }
 * }
 * @see {@link HypixelPlayer}
 */
export const EnumMinecraftFireworkShapes = ZodEnumMinecraftFireworkShapes.enum;

export const ZodEnumMinecraftFormatting = z.enum([
    "BLACK",
    "DARK_BLUE",
    "DARK_GREEN",
    "DARK_AQUA",
    "DARK_RED",
    "DARK_PURPLE",
    "GOLD",
    "GRAY",
    "DARK_GRAY",
    "BLUE",
    "GREEN",
    "AQUA",
    "RED",
    "LIGHT_PURPLE",
    "YELLOW",
    "WHITE",
    "OBFUSCATED",
    "BOLD",
    "STRIKE",
    "UNDERLINE",
    "ITALIC",
    "RESET"
])

/**
 * Enumerable object containing all the currently-used Minecraft formatting styles on Hypixel. Each value is a
 *   CAMEL_CASE representation of the color code name. For the formatting style's code, use {@link getFormattingCode} to convert
 *   it.
 * @see https://minecraft.wiki/w/Formatting_codes
 * @see {@link MinecraftFormattingCode}
 * @see {@link getFormattingCode}
 */
export const EnumMinecraftFormatting = ZodEnumMinecraftFormatting.enum;

/**
 * Type containing all the currently-used Minecraft formatting codes on Hypixel.
 *
 * @see https://minecraft.wiki/w/Formatting_codes
 * @see {@link EnumMinecraftFormatting}
 * @see {@link getFormattingCode}
 */
export type MinecraftFormattingCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'k' | 'l' | 'm' | 'n' | 'o' | 'r';
