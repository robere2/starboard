import z from "zod";
import {UnixDate} from "../../../../util.ts";

export const ZodUnixDate = z.preprocess((arg: any) => new UnixDate(arg), z.date())
