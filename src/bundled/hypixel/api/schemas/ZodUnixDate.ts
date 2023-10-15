import z from "zod";
import {UnixDate} from "../../../../util.ts";

export const ZodUnixDate = z.custom<UnixDate>(value => {
    return typeof value === "number" && value >= 0;
}, "Invalid Date input").transform(value => new UnixDate(value))
