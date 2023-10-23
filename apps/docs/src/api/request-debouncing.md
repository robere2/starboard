# Request Debouncing

Your Hypixel API key has a [limit](https://api.hypixel.net/#section/Introduction/Limits) to how often you can use it
(called the rate limit). To avoid accidentally going over this limit, debouncing can be enabled to space requests
apart enough such that you never go over your rate limit. The downside to this is that your request could be delayed
for seconds before being sent to the API, which can cause a poor user experience. Regardless, we recommend keeping
debouncing enabled in most situations.

Debouncing is controlled through the `deferPolicy` option, which takes any `IDeferPolicy` instance. The default is:

```ts [TypeScript]
const hypixel = new HypixelAPI({
    apiKey: "98cb0f8d-b14d-4b29-ae84-0a4d2bf35039",
    deferPolicy: new RateLimitDeferPolicy(
        "RateLimit-Limit",
        "RateLimit-Remaining",
        "RateLimit-Reset",
        300_000 // Number of milliseconds between rate limit resets
    )
})
```
