<script setup>
import ApiRefLink from "../components/ApiRefLink.vue"
</script>

# Request Debouncing

Your Hypixel API key has a [limit](https://api.hypixel.net/#section/Introduction/Limits) to how often you can use it
(called the rate limit). To avoid accidentally going over this limit, debouncing can be enabled to space requests
apart enough such that you never go over your rate limit. The downside to this is that your request could be delayed
for seconds before being sent to the API, which can cause a poor user experience. Regardless, we recommend keeping
debouncing enabled in most situations.

Debouncing is controlled through the `deferPolicy` option, which takes any <ApiRefLink name="IDeferPolicy" /> instance. 
The default is a <ApiRefLink name="RateLimitDeferPolicy" /> with the following options:

```ts [TypeScript]
const hypixel = await HypixelAPI.create({
    apiKey: "98cb0f8d-b14d-4b29-ae84-0a4d2bf35039",
    deferPolicy: new RateLimitDeferPolicy(
        "RateLimit-Limit",
        "RateLimit-Remaining",
        "RateLimit-Reset",
        300_000 // Number of milliseconds between rate limit resets
    )
})
```

## Bursts

The default Hypixel API key rate limit is 300 requests per 5 minutes. With debouncing enabled, this could result in
every API request being delayed for up to a second. This doesn't seem like a long time, but it can be detrimental to the
user experience. To solve this issue, <ApiRefLink name="RateLimitDeferPolicy" /> allows you to make a burst of requests
in quick succession without debouncing them.

With bursts enabled, the first few requests within a given interval will be sent out immediately, allowing you
to get a speedy response to your API query. However, if your remaining number of requests for the current rate limit
interval falls below a certain threshold, or if the number of API requests you send is too rapid for bursting to keep
up, then the debouncing delay will gradually increase beyond one second when it is used.

All burst thresholds and timings are customizable; refer to the <ApiRefLink name="RateLimitDeferPolicy" /> reference to 
view them and their defaults. If you notice that the debounce period for requests is too large for your use-case, consider modifying your
debounce or cache settings. If all else fails, you may consider applying for a Hypixel API key rate limit increase.
