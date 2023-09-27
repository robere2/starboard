import {Route} from "./Route.ts";

const HYPIXEL_API_URL = "https://api.hypixel.net";
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export class HypixelRoute extends Route {
    private name: string;
    private readonly key: string;

    constructor(path: string, name: string, key: string) {
        super(path);
        if(!uuidRegex.test(key)) {
            throw new Error("Invalid API key");
        }
        this.name = name;
        this.key = key;
    }

    public handle(req: Request): Response | Promise<Response> {
        const url = new URL(HYPIXEL_API_URL + this.path);
        for(const param of new URL(req.url).searchParams.entries()) {
            url.searchParams.append(param[0], param[1]);
        }
        const hypixelRequest = new Request({
            url: url.toString(),
            headers: {
                "API-Key": this.key
            }
        })

        return fetch(hypixelRequest);
    }
}
