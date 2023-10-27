import * as z from "zod";
import {UUID_REGEX} from "../../util";

export const MojangUsernameToUuidSchema = z.object({
    name: z.string().nullish(),
    id: z.string().regex(UUID_REGEX).nullish(),
    legacy: z.boolean().nullish(),
    demo: z.boolean().nullish(),
    error: z.string().nullish(),
    errorMessage: z.string().nullish(),
    path: z.string().nullish()
}).readonly()
