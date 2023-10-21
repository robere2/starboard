import {Service} from "./Service";
import {serve, ServeOptions} from "./serve";
import {Server} from "http";

export class Starboard extends Service {

    private server?: Server;
    private options: ServeOptions | undefined;

    constructor(options?: ServeOptions) {
        super('/');
        this.options = options;
    }

    public async start(): Promise<void> {
        if(this.server) {
            throw new Error('Server is already running')
        }

        this.server = await serve(async (req: Request): Promise<Response> => {
            const endpoint = this.allEndpoints().get(new URL(req.url).pathname)
            if(endpoint) {
                return endpoint.handle(req);
            }
            return new Response(JSON.stringify({error: 404}), {
                status: 404
            });
        }, {
            port: this.options?.port ?? 4381,
            hostname: this.options?.hostname ?? "localhost",
            allowedHosts: this.options?.allowedHosts || [this.options?.hostname ?? "localhost"],
            https: this.options?.https ?? false
        })
    }

    public isRunning(): boolean {
        return this.server !== undefined;
    }

    public getServer(): Server | undefined {
        return this.server;
    }

    public stop(): void {
        throw new Error("Not implemented");
    }

    public getPort(): number {
        throw new Error("Not implemented");
    }

    public getHostname(): string {
        throw new Error("Not implemented");
    }
}
