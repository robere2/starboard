import z from "zod";

export const ZodEnumHypixelGuildAchievements = z.enum([
    "EXPERIENCE_KINGS",
    "WINNERS",
    "ONLINE_PLAYERS"
])

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

export const ZodEnumHypixelSkyBlockDungeonClasses = z.enum([
    "healer",
    "archer",
    "mage",
    "tank",
    "berserk"
])

export const ZodEnumHypixelPlayerCounts = z.enum([
    ...ZodEnumHypixelGames.options,
    "MAIN_LOBBY",
    "TOURNAMENT_LOBBY",
    "LIMBO",
    "IDLE",
    "QUEUE"
])

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

export const ZodEnumMinecraftFireworkShapes = z.enum([
    "BURST",
    "STAR",
    "BALL_LARGE",
    "BALL",
    "CREEPER"
]);

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

type MinecraftFormattingCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'k' | 'l' | 'm' | 'n' | 'o' | 'r';

export function getCode(color: z.infer<typeof ZodEnumMinecraftFormatting>): MinecraftFormattingCode {
    switch (color) {
        default:
            throw new Error("Invalid color: " + color)
        case "BLACK":
            return 0;
        case "DARK_BLUE":
            return 1;
        case "DARK_GREEN":
            return 2;
        case "DARK_AQUA":
            return 3;
        case "DARK_RED":
            return 4;
        case "DARK_PURPLE":
            return 5;
        case "GOLD":
            return 6;
        case "GRAY":
            return 7;
        case "DARK_GRAY":
            return 8;
        case "BLUE":
            return 9;
        case "GREEN":
            return 'a';
        case "AQUA":
            return 'b';
        case "RED":
            return 'c';
        case "LIGHT_PURPLE":
            return 'd';
        case "YELLOW":
            return 'e';
        case "WHITE":
            return 'f';
        case "OBFUSCATED":
            return 'k';
        case "BOLD":
            return 'l';
        case "STRIKE":
            return 'm';
        case "UNDERLINE":
            return 'n';
        case "ITALIC":
            return 'o';
        case "RESET":
            return 'r';
    }
}
