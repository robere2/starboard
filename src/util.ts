/**
 * Regular expression for v4 UUIDs, with the dashes being optional. The Hypixel API uses and accepts them
 *   interchangeably.
 */
export const UUID_REGEX = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

export const MONGODB_ID_REGEX = /^[0-9a-f]{24}$/i;

export type ParsedOptions<T> = Readonly<{
    [P in keyof T]-?: T[P];
}>

/**
 * An extension of Date which overrides the `toJSON` function to return the unix timestamp value (`Date.getTime()`)
 *   instead of an ISO 8601 string. This can be used to avoid pre-/post-processing on stringified objects.
 *   Specifically, this is used by Starboard to easily convert Hypixel API unix timestamps back into timestamps after
 *   stringifying, so the output mirrors that of the Hypixel API.
 */
export class UnixDate extends Date {
    toJSON(): any {
        return this.getTime()
    }
}

/**
 * Function to calculate a player's current level based on how much experience they have. The amount of experience
 *   per level increases by 2,500 for each level, and starts at 10,000 to get from level 1 to 2. Players start at level
 *   1 (i.e., no level 0).
 *
 *   Unlike {@link networkExpToLevel}, this function does support partial levels. Because experience per level grows
 *   quadratically, the calculated value between two levels is not going to be linear. For example, if level 2 requires
 *   10,000 total XP and level 3 requires 22,500 total XP, the midpoint would be 16,250. However, this equates to ~1.525
 *   on the curve. This is often not the desired value, but this function is available for when it is. To get a linear
 *   progression to the next level instead, use {@link networkExpToLevel} and {@link networkLevelProgress}.
 * @param exp Amount of network experience to get the corresponding level for. Must be an integer
 *   greater than or equal to 0. Behavior is undefined when greater than
 *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER|Number.MAX_SAFE_INTEGER}.
 * @throws Error if the provided value is not an integer greater than or equal to 0.
 * @returns The maximum network level that the given amount of experience is able to get a player to.
 *
 * @see networkExpToLevel
 * @see networkLevelRemainingExp
 * @see networkLevelToExp
 * @see networkLevelExpDifference
 * @see networkLevelProgress
 * @see networkLevelRemainingExp
 *
 * @example
 *   networkExpToLevelQuadratic(16250) // 2.524937810560445
 */
export function networkExpToLevelQuadratic(exp: number): number {
    return 1/ 50 * (-175 + Math.sqrt(30625 + 2 * exp)) + 1;
}

/**
 * Function to calculate a player's current level based on how much experience they have. The amount of experience
 *   per level increases by 2,500 for each level, and starts at 10,000 to get from level 1 to 2. Players start at level
 *   1 (i.e., no level 0).
 *
 *   This function does not return partial levels, and instead rounds down. Because experience per level grows
 *   quadratically, the calculated value between two levels is not going to be linear. For example, if level 2 requires
 *   10,000 total XP and level 3 requires 22,500 total XP, the midpoint would be 16,250. However, this equates to ~2.525
 *   on the curve. This is likely not the desired behavior by someone using this function, so we don't include it. If
 *   you want this value, use {@link networkExpToLevelQuadratic}. To get a linear progression to the
 *   next level, use {@link networkLevelProgress}.
 * @param exp Amount of network experience to get the corresponding level for. Must be an integer
 *   greater than or equal to 0. Behavior is undefined when greater than
 *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER|Number.MAX_SAFE_INTEGER}.
 * @throws Error if the provided value is not an integer greater than or equal to 0.
 * @returns The network level that the given amount of experience is able to get a player to, but no
 *   more.
 *
 * @see networkExpToLevelQuadratic
 * @see networkLevelRemainingExp
 * @see networkLevelToExp
 * @see networkLevelExpDifference
 * @see networkLevelProgress
 * @see networkLevelRemainingExp
 *
 * @example
 *   networkExpToLevel(10000) // 2
 *   networkExpToLevel(22500) // 3
 *   networkExpToLevel(37500) // 4
 */
export function networkExpToLevel(exp: number): number {
    if(exp < 0 || !Number.isInteger(exp)) {
        throw new Error("Experience must be a number greater than or equal to 0")
    }
    return Math.floor(networkExpToLevelQuadratic(exp))
}

/**
 * Calculate the amount of experience required to reach a given network level starting from zero experience. This
 *   function is not able to handle partial levels (i.e., non-integer inputs). To get a linear partial level, use
 *   {@link networkLevelExpDifference}. Getting the quadratic partial level is currently not supported.
 * @param level Network level to calculate the amount of experience required to reach. Must be an integer greater than
 *   or equal to 1. Behavior is undefined when greater than 2,684,352, as above this, the required experience is greater
 *   than {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER|Number.MAX_SAFE_INTEGER}.
 * @throws Error if the provided value is not an integer greater than or equal to 1.
 * @returns The minimum amount of experience a player would need to get in order to get from 0 EXP to the provided
 *   level.
 * @see networkExpToLevelQuadratic
 * @see networkLevelRemainingExp
 * @see networkExpToLevel
 * @see networkLevelExpDifference
 * @see networkLevelProgress
 * @see networkLevelRemainingExp
 *
 * @example
 *   networkLevelToExp(1) // 0
 *   networkLevelToExp(2) // 10000
 *   networkLevelToExp(3) // 22500
 *   networkLevelToExp(4) // 37500
 */
export function networkLevelToExp(level: number): number {
    if(level < 1 || !Number.isInteger(level)) {
        throw new Error("Level must be an integer greater than or equal to 1")
    }
    return 1250 * (level - 1) ** 2 + 8750 * (level - 1);
}

/**
 * The difference in experience required to reach two given network levels. This is just equivalent to
 *    `networkLevelToExp(b) - networkLevelToExp(a)`. As a result, this function cannot handle partial levels.
 * @param a First network level, inclusive. Must be an integer greater than or equal to 1. Behavior is undefined when
 *   greater than 2,684,352, as above this, the required experience for the level is greater than
 *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER|Number.MAX_SAFE_INTEGER}.
 * @param b Second network level, exclusive. Must be an integer greater than or equal to 1. Behavior is undefined when
 *   greater than 2,684,352, as above this, the required experience for the level is greater than
 *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER|Number.MAX_SAFE_INTEGER}.
 * @throws Error if either of the provided values are less than 0 or not integers.
 * @returns The difference in experience required to reach the second level from the first level.
 *
 * @see networkLevelRemainingExp
 * @see networkExpToLevel
 * @see networkLevelToExp
 * @see networkLevelProgress
 * @see networkLevelRemainingExp
 *
 * @example
 *   networkLevelExpDifference(1, 2) // 10000
 *   networkLevelExpDifference(2, 3) // 12500
 *   networkLevelExpDifference(2, 4) // 27500
 */
export function networkLevelExpDifference(a: number, b: number): number {
    return networkLevelToExp(b) - networkLevelToExp(a);
}

/**
 * Calculates the amount of experience needed to reach a given network level starting from the provided experience.
 * @param exp Base amount of network experience, e.g. what a player has already earned. Behavior is undefined
 *   when greater than
 *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER|Number.MAX_SAFE_INTEGER}.
 * @param level Network level to calculate the amount of remaining experience required to reach.
 *   Must be an integer greater than or equal to 1. Behavior is undefined when greater than 2,684,352, as above
 *   this, the required experience is greater than
 *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER|Number.MAX_SAFE_INTEGER}.
 * @throws Error if the provided level is less than 0 or not an integer.
 * @returns The remaining amount of XP required to reach the provided level. If the starting amount of XP is
 *   already passed the required amount of XP for the level, a negative number will be returned, indicative of how much
 *   XP it is over (or 0, if the XP is exactly the right amount).
 * @example
 *   // Amount of experience remaining to get to the next level.
 *   const exp = 50000;
 *   const level = networkExpToLevel(exp); // 4
 *   const remaining = networkLevelRemainingExp(exp, level + 1); // 5000
 * @see networkLevelRemainingExp
 * @see networkExpToLevel
 * @see networkLevelToExp
 * @see networkLevelExpDifference
 * @see networkLevelProgress
 */
export function networkLevelRemainingExp(exp: number, level: number): number {
    return networkLevelToExp(level) - exp;
}

/**
 * Linear progress between two network levels.
 * @param exp Amount of network experience to get the corresponding linear progression point for, e.g. the player's
 *   current experience.
 * @param target Network level to calculate the linear progression point for. Must be an integer greater than or equal
 *   to 1. Must not be equal to `start`. Behavior is undefined when greater than 2,684,352, as above this, the required
 *   experience for the level is greater than
 *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER|Number.MAX_SAFE_INTEGER}.
 *
 * @param start Optional starting network level. Defaults to 1. Must be an integer greater than or equal to 1. Must not
 *   be equal to `start`. Behavior is undefined when greater than 2,684,352, as above this, the required experience for
 *   the level is greater than
 *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER|Number.MAX_SAFE_INTEGER}
 * @throws Error if either `start` or `target` are less than 0 or not integers.
 * @throws Error if `target` and `start` are equal to each other.
 * @returns A floating point value between 0 and 1 indicating the point at which `exp` sits on the
 *   linear scale between `start` and `target`. Value will be greater than 1 if `exp` is already greater than
 *   the required experience for the `target` level, or will be less than 0 if `exp` is less than the
 *   required experience for the `start` level.
 * @example
 *   // Progress to get to the next level.
 *   const exp = 16250; // (level 2 EXP + level 3 EXP) / 2
 *   const level = networkExpToLevel(exp); // 2
 *   const remaining = networkLevelProgress(exp, level + 1, level); // 0.5
 * @see networkLevelRemainingExp
 * @see networkExpToLevel
 * @see networkLevelToExp
 * @see networkLevelExpDifference
 * @see networkLevelRemainingExp
 */
export function networkLevelProgress(exp: number, target: number, start: number = 1): number {
    return (exp - networkLevelToExp(start)) / (networkLevelToExp(target) - networkLevelToExp(start));
}

