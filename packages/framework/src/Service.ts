import {Endpoint} from "./Endpoint";
import {Plugin} from "./Plugin";
import urlJoin from "url-join";

function normalizeUrlPath(str: string): string {
    const components = str.split('/').filter((v) => v !== '');
    const normalizedComponents: string[] = [];
    for(const comp of components) {
        if(comp === '..' && normalizedComponents.length > 0) {
            normalizedComponents.pop()
        } else if(comp !== '.') {
            normalizedComponents.push(comp);
        }
    }
    let result = normalizedComponents.join('/');
    if(str.endsWith('/')) {
        result += '/';
    }
    return result || '.';
}

export class Service {
    private readonly endpoints: Map<string, Endpoint> = new Map();
    private readonly subservices: Service[] = [];
    public readonly path: string;

    constructor(inputPath: string) {
        this.path = normalizeUrlPath(inputPath);
        if(this.path.startsWith("..")) {
            throw new Error('Path cannot start with ".."');
        }
    }

    public addService(service: Service): this {
        this.subservices.push(service);
        if(this.searchForCircularStructure()) {
            this.subservices.pop()
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
                .map(([endpointPath, endpoint]) => [urlJoin(this.path, endpointPath), endpoint])
        )
    }

    public allEndpoints(): Map<string, Endpoint> {
        const endpoints: Map<string, Endpoint> = this.ownEndpoints();

        for (const subservice of this.subservices) {
            for (const [endpointPath, endpoint] of subservice.allEndpoints()) {
                const joinedPath = urlJoin(this.path, endpointPath);
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

    public destroy(): void {
        for(const svc of this.subservices) {
            svc.destroy();
        }
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
