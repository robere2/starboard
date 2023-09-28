import {Endpoint} from "../endpoint/Endpoint.ts";
import path from "path";
import {Plugin} from "../plugin/Plugin.ts";


export class Service {
    private readonly endpoints: Map<string, Endpoint> = new Map();
    private readonly subservices: Service[] = [];
    public readonly path: string;

    constructor(path: string) {
        this.path = path;
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
        return new Map(this.endpoints)
    }

    public allEndpoints(): Map<string, Endpoint> {
        const endpoints: Map<string, Endpoint> = new Map();
        for (const [endpointPath, endpoint] of this.ownEndpoints()) {
            const joinedPath = path.join(this.path, endpointPath);
            if (endpoints.has(joinedPath)) {
                throw new Error(`Duplicate endpoint path ${joinedPath}`);
            }
            endpoints.set(joinedPath, endpoint)
        }
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
