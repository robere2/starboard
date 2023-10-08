import {HypixelEntity} from "./HypixelEntity.ts";
import {HypixelResources} from "./resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";

export class HypixelPunishmentStatistics extends HypixelEntity {
    public readonly watchdog_lastMinute: number;
    public readonly watchdog_rollingDaily: number;
    public readonly staff_rollingDaily: number;
    public readonly watchdog_total: number;
    public readonly staff_total: number;
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelPunishmentStatistics>) {
        super(root, resources);
        Object.assign(this, input);

        this.watchdog_lastMinute = input.watchdog_lastMinute ?? 0;
        this.watchdog_rollingDaily = input.watchdog_rollingDaily ?? 0;
        this.staff_rollingDaily = input.staff_rollingDaily ?? 0;
        this.watchdog_total = input.watchdog_total ?? 0;
        this.staff_total = input.staff_total ?? 0;
    }
}
export type HypixelPunishmentStatisticsResponse = HypixelAPIResponse<HypixelPunishmentStatistics>;
