<script setup>
import ApiRefLink from "../components/ApiRefLink.vue"
</script>

# Raw Requests

One of the ways that Starboard tries to assist you is by not returning the full API response, but just the data you're
looking for. Request metadata like the `success` and `reason` are handled internally by Starboard. Additionally,
Starboard attempts to set some sensible defaults when a value is null or undefined. Specifically, we default missing
arrays to an empty array `[]`, and we default inferred-type objects to an empty object `{}`. Usually these are helpful
features, but there may be occasions where you need to use this data that Starboard is hiding from you.

Starboard allows you to bypass all type checking, and value narrowing defaulting by sending a "raw" request. Each getter
on the <ApiRefLink name="HypixelAPI" /> will accept a boolean `raw` parameter as it's final argument. When you send a
raw request, a <ApiRefLink name="BaseResponse" /> object will be returned.

```js
const hypixel = HypixelAPI.create({
    apiKey: "98cb0f8d-b14d-4b29-ae84-0a4d2bf35039"
});

const response = hypixel.getSkyBlockProfiles("ee427219-42fe-40f9-a335-822bae1e6f63", true);
console.log("Response success:", response.success);

if(response?.profiles !== null && response?.profiles?.length === 0) {
    console.log("Profiles array is present but empty! Profile deleted?");
}
```

If you're using TypeScript, the <ApiRefLink name="BaseResponse" /> class has no type definitions beyond the request 
metadata fields like `success`. Accessing other properties is allowed, but they will be type `any`. Usually, we 
recommend you perform your type checks on the fly, similar to what you see above. However, when working with the same 
data frequently, it may be helpful to have the benefits of types. 

Starboard does not offer a way to perform full type checks on the response without also assigning default values. If you
want to have typed data within the response, you need to perform the necessary type checks and casting yourself. For 
this, you can use [type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates).

```ts
type ProfilesResponse = BaseResponse & { profiles: unknown[] };

function isProfilesResponse(input: BaseResponse): input is ProfilesResponse {
    return Array.isArray(input.profiles)
}

const hypixel = HypixelAPI.create({
    apiKey: "98cb0f8d-b14d-4b29-ae84-0a4d2bf35039"
});

const response = hypixel.getSkyBlockProfiles("ee427219-42fe-40f9-a335-822bae1e6f63", true);

if(isProfilesResponse(response)) {
    console.log(response.profiles); // Intellisense!
}
```

However, if you're working with lots of fields, this is going to get tedious at scale. Starboard uses the
[`zod`](https://www.npmjs.com/package/zod) package internally. You can define your own zod schema to perform type checks
and generate inferred types.

```js
import { z } from "zod";

const schema = z.object({
    profiles: z.array(z.object({
        members: z.array(z.object({
            death_count: z.number().nonnegative().default(0)
        })).default([])
    })).default([])
});

const hypixel = HypixelAPI.create({
    apiKey: "98cb0f8d-b14d-4b29-ae84-0a4d2bf35039"
});

const rawResponse = hypixel.getSkyBlockProfiles("ee427219-42fe-40f9-a335-822bae1e6f63", true);
const parsedResponse = z.parse(rawResponse);

// Will default to 0, however will still be undefined if either profiles or the members array are empty
console.log(parsedResponse.profiles[0]?.members[0]?.death_count);
```

Zod also allows you to apply more rigorous defaults to the data, embed custom methods, or other transformations and type
checks. For more information, check out the [zod documentation](https://zod.dev/).
