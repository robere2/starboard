import {Endpoint} from "../../endpoint/Endpoint.ts";
import path from "path";

const HYPIXEL_API_URL = "https://api.hypixel.net";
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export class HypixelEndpoint extends Endpoint {
    private readonly key: string;
    private readonly path: string;

    constructor(path: string, key: string) {
        super();
        if(!uuidRegex.test(key)) {
            throw new Error("Invalid API key");
        }
        this.path = path;
        this.key = key;
    }

    public handle(req: Request): Response | Promise<Response> {
        const url = new URL(path.join(HYPIXEL_API_URL, this.path));
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
