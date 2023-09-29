import {Endpoint} from "../endpoint/Endpoint.ts";
import path from "path";
import {Plugin} from "../plugin/Plugin.ts";


export class Service {
    private readonly endpoints: Map<string, Endpoint> = new Map();
    private readonly subservices: Service[] = [];
    public readonly path: string;

    constructor(inputPath: string) {
        this.path = path.normalize(inputPath);
        if(this.path.startsWith("..")) {
            throw new Error('Path cannot start with ".."');
        }
    }

    public addService(service: Service): this {
        this.subservices.push(service);
        if(this.searchForCircularStructure()) {
            throw new Error('Circular service structure detected');
        }
        return this;
    }

    public addEndpoint(path: string, endpoint: Endpoint): this {
        this.endpoints.set(path, endpoint);
        return this;
    }

    public addPlugin(plugin: Plugin): this {
        for(const [endpointPath, endpoint] of this.allEndpoints()) {
            endpoint.handle = plugin.install(endpoint.handle.bind(endpoint), endpointPath, endpoint)
        }
        return this;
    }

    public ownEndpoints(): Map<string, Endpoint> {
        // Map the Map values to prepend this service's path to the endpoint path
        return new Map(
            Array.from(this.endpoints)
                .map(([endpointPath, endpoint]) => [path.join(this.path, endpointPath), endpoint])
        )
    }

    public allEndpoints(): Map<string, Endpoint> {
        const endpoints: Map<string, Endpoint> = this.ownEndpoints();

        for (const subservice of this.subservices) {
            for (const [endpointPath, endpoint] of subservice.allEndpoints()) {
                const joinedPath = path.join(this.path, endpointPath);
                if (endpoints.has(joinedPath)) {
                    throw new Error(`Duplicate endpoint path ${joinedPath}`);
                }
                endpoints.set(joinedPath, endpoint)
            }
        }

        return endpoints;
    }

    public getServices(): Service[] {
        return [...this.subservices];
    }

    protected searchForCircularStructure(visited: Service[] = []): boolean {
        if (visited.includes(this)) {
            return true;
        }
        visited.push(this);
        for (const subservice of this.subservices) {
            if (subservice.searchForCircularStructure(visited)) {
                return true;
            }
        }
        return false;
    }
}
