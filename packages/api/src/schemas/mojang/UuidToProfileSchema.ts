import * as z from "zod";
import {BASE_64_REGEX, UUID_REGEX} from "../../util";
import {ZodUnixDate} from "../ZodUnixDate";

export type MojangProfile = z.infer<typeof UuidToProfileSchema>

const MojangProfileTexturesSchema = z.object({
    timestamp: ZodUnixDate.readonly(),
    profileId: z.string().regex(UUID_REGEX),
    profileName: z.string(),
    signatureRequired: z.boolean().nullish(),
    textures: z.object({
        SKIN: z.object({
            url: z.string().url(),
            metadata: z.object({
                model: z.custom<`classic` | `slim`>((val) => {
                    return typeof val === "string" && (val === "classic" || val == "slim")
                })
            }).nullish().readonly()
        }).nullish().readonly(),
        CAPE: z.object({
            url: z.string().url()
        })
    }).nullish().readonly(),
})

export const UuidToProfileSchema = z.object({
    name: z.string().nullish(),
    id: z.string().regex(UUID_REGEX).nullish(),
    legacy: z.boolean().nullish(),
    profileActions: z.array(z.string()).default([]).readonly(),
    properties: z.array(
        z.object({
            name: z.literal("textures"),
            value: z.string().regex(BASE_64_REGEX).transform((base64) => {
                // Texture data is base-64 encoded
                return MojangProfileTexturesSchema.parse(JSON.parse(atob(base64)));
            }),
            signature: z.string().regex(BASE_64_REGEX).nullish()
        })
    ).max(1).default([]),
    error: z.string().nullish(),
    errorMessage: z.string().nullish(),
    path: z.string().nullish()
}).passthrough()
