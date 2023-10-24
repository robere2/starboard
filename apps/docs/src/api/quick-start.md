<script setup>
import ApiRefLink from "../components/ApiRefLink.vue"
</script>

# Quick Start

The <ApiRefLink name="HypixelAPI" /> class allows you to communicate with the Hypixel API. Starboard supports both ESM 
and CommonJS imports:

::: code-group

```js [ESM]
import {HypixelAPI} from "@mcsb/api";
```

```js [CommonJS]
const HypixelAPI = require("@mcsb/api").HypixelAPI;
```

:::

The `apiKey` option is required when instantiating <ApiRefLink name="HypixelAPI" />. Hypixel API keys are v4 UUIDs used 
to authorize your application. You can request one on the [Hypixel Developer Dashboard](https://developer.hypixel.net/dashboard).

```ts [TypeScript]
const hypixel = await HypixelAPI.create({
    apiKey: "98cb0f8d-b14d-4b29-ae84-0a4d2bf35039"
})

const boosters = await hypixel.getBoosters() // HypixelBooster[]
```

Caching and request debouncing are both enabled by default. You can configure them in the options you pass 
to <ApiRefLink name="HypixelAPI" />. Check their documentation for more information:

- [Request debouncing](request-debouncing)
- [Response caching](customizing-http-client#cache)
