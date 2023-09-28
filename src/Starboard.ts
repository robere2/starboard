import {Server} from "bun";
import {Service} from "./service/Service.ts";

export class Starboard extends Service {

    private server?: Server;
    private readonly port: number;
    private readonly hostname: string;

    constructor(port = 4381, hostname = "localhost") {
        super('/');
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
                for(const [endpointPath, endpoint] of this.allEndpoints()) {
                    if(endpointPath === url.pathname) {
                        return endpoint.handle(req);
                    }
                }
                return new Response('Hello, world!');
            }
        })
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
