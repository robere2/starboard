import {HypixelEndpoint} from "../HypixelEndpoint.ts";
import {HypixelAPI} from "../api/HypixelAPI.ts";

export class HypixelPlayerEndpoint extends HypixelEndpoint {
    constructor(api: HypixelAPI) {
        super(api);
    }

    public async handle(req: Request): Promise<Response> {
        const url = new URL(req.url);
        const queryString = url.searchParams;

        try {
            if(queryString.has('uuid')) {
                const uuid = queryString.get('uuid');
                return new Response(JSON.stringify(await this.api.getPlayer(uuid ?? '')), {
                    headers: {"Content-Type": "application/json"}
                });
            } else if(queryString.has('name')) {
                const name = queryString.get('name');
                return new Response(JSON.stringify(await this.api.getPlayer(name ?? '')), {
                    headers: {"Content-Type": "application/json"}
                });
            } else {
                return new Response(JSON.stringify({"error": "uuid or name is required"}), {
                    status: 400,
                    headers: {"Content-Type": "application/json"}
                })
            }
        } catch(e: any) {
            if(e instanceof Error) {
                console.error(e.stack + "\nCause: " + e.cause)
            }
            return new Response(JSON.stringify({"error": "Internal Server Error"}), {
                status: 500,
                headers: {"Content-Type": "application/json"}
            });
        }
    }
}
