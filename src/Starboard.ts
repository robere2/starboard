import {Server} from "bun";
import {Route} from "./route/Route.ts";

export class Starboard {

    private server?: Server;
    private readonly port: number;
    private readonly hostname: string;
    private readonly routes: Route[] = [];

    constructor(port = 4381, hostname = "localhost") {
        this.port = port;
        this.hostname = hostname;
    }

    public start(): void {
        this.assertServerStopped()
        this.server = Bun.serve({
            port: this.port,
            hostname: this.hostname,
            fetch: async (req: Request): Promise<Response> => {
                const url = new URL(req.url);
                for(const route of this.routes) {
                    console.log(url.pathname);
                    if(route.path === url.pathname) {
                        return route.handle(req);
                    }
                }
                return new Response('Hello, world!');
            }
        })
    }

    public addRoute(route: Route): this {
        this.routes.push(route);
        return this;
    }

    public isRunning(): boolean {
        return this.server !== undefined;
    }

    public stop(): void {
        this.assertServerRunning();
        this.server?.stop();
        this.server = undefined;
    }

    public getPort(): number {
        this.assertServerRunning();
        return this.server?.port as number
    }

    public getHostname(): string {
        this.assertServerRunning();
        return this.server?.hostname as string
    }

    private assertServerStopped(): void {
        if(this.server) {
            throw new Error('Server is already running')
        }
    }
    private assertServerRunning(): void {
        if(!this.server) {
            throw new Error('Server is not running')
        }
    }
}
