import z from "zod";
import {BaseSchema} from "../../../BaseAPI.ts";

export type PunishmentStatisticsSchema = ReturnType<typeof generatePunishmentStatisticsSchema>;
export type HypixelPunishmentStatistics = z.infer<PunishmentStatisticsSchema>;

export function generatePunishmentStatisticsSchema() {
    return BaseSchema.extend({
        watchdog_lastMinute: z.number().nonnegative().nullish(),
        staff_rollingDaily: z.number().nonnegative().nullish(),
        watchdog_total: z.number().nonnegative().nullish(),
        watchdog_rollingDaily: z.number().nonnegative().nullish(),
        staff_total: z.number().nonnegative().nullish()
    })
}
