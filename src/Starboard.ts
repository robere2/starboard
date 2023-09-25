import {Server} from "bun";

export class Starboard {

    private server?: Server;
    private readonly port: number;
    private readonly hostname: string;

    constructor(port = 4381, hostname = "localhost") {
        this.port = port;
        this.hostname = hostname;
    }

    public start(): void {
        this.server = Bun.serve({
            port: this.port,
            hostname: this.hostname,
            fetch(req: Request): Response {
                return new Response('Hello, world!');
            }
        })
    }

    public isRunning(): boolean {
        return this.server !== undefined;
    }

    public stop(): void {
        if(!this.server) {
            throw new Error('Starboard.stop() was called but the server is already stopped')
        }
        this.server.stop();
        this.server = undefined;
    }
}
