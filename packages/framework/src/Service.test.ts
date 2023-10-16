import {expect, Mock, mock, test} from "bun:test";
import {Service} from "./Service";
import {Endpoint} from "./Endpoint";
import {Plugin} from "./Plugin";
import {Executor} from "./Executor";

class DummyEndpoint extends Endpoint {
    async handle(): Promise<Response> {
        return new Response("");
    }
}

class DummyPlugin extends Plugin {
    public installTimeMock: Mock<() => void>;
    public runTimeMock: Mock<() => void>;

    constructor() {
        super();
        this.installTimeMock = mock(() => {})
        this.runTimeMock = mock(() => {})
    }

    install(fn: Executor["handle"], endpointPath: string, endpoint: Endpoint): Executor["handle"] {
        this.installTimeMock();
        return (req) => {
            this.runTimeMock();
            return fn(req);
        }
    }

}

test('Correctly parses the path', () => {
    let svc = new Service("testing")
    expect(svc.path).toBe("testing")
    svc = new Service("multi/directory/paths")
    expect(svc.path).toBe("multi/directory/paths")
    svc = new Service("allows/ending/slash/")
    expect(svc.path).toBe("allows/ending/slash/")
    svc = new Service("empty//dirs///here")
    expect(svc.path).toBe("empty/dirs/here")
    svc = new Service("")
    expect(svc.path).toBe(".")
    svc = new Service(".")
    expect(svc.path).toBe(".")
    svc = new Service("test/..")
    expect(svc.path).toBe(".")
    svc = new Service("test/123/..")
    expect(svc.path).toBe("test")
    svc = new Service("test/./123")
    expect(svc.path).toBe("test/123")
    expect(() => new Service("..")).toThrow()
    expect(() => new Service("test/../..")).toThrow()
})

test('Keeps track of subservices',  () => {
    const svc = new Service("service1")
    svc.addService(new Service("service2"))
    svc.addService(new Service("service3"))
    svc.addService(new Service("service4"))

    const subservices = svc.getServices();
    expect(subservices.length).toBe(3)

    const service1Count = subservices.filter(s => s.path === "service2").length
    expect(service1Count).toBe(1)
    const service2Count = subservices.filter(s => s.path === "service3").length
    expect(service2Count).toBe(1)
    const service3Count = subservices.filter(s => s.path === "service4").length
    expect(service3Count).toBe(1)
})

test('Does not allow direct editing of the services array', () => {
    const svc = new Service("service1")
    svc.addService(new Service("service2"))
    svc.addService(new Service("service3"))
    svc.getServices().push(new Service("service4"))
    expect(svc.getServices().length).toBe(2)
})

test('ownEndpoints returns a map of its own endpoints, and own endpoints only', () => {
    const dummyEndpoint1 = new DummyEndpoint();
    const dummyEndpoint2 = new DummyEndpoint();
    const svc = new Service("service1")
    svc.addService(new Service("service2").addEndpoint("endpoint1", dummyEndpoint1))
    svc.addEndpoint("endpoint2", dummyEndpoint2)

    const endpoints = svc.ownEndpoints();

    expect(endpoints.get("service1/endpoint1")).toBeUndefined();
    expect(endpoints.get("service1/service2/endpoint1")).toBeUndefined();
    expect(endpoints.get("service1/endpoint2")).toEqual(dummyEndpoint2)
})

test('allEndpoints returns a map of its own endpoints and all subservice endpoints', () => {
    const dummyEndpoint1 = new DummyEndpoint();
    const dummyEndpoint2 = new DummyEndpoint();
    const svc = new Service("service1")
    svc.addService(new Service("service2").addEndpoint("endpoint1", dummyEndpoint1))
    svc.addEndpoint("endpoint2", dummyEndpoint2)

    const endpoints = svc.allEndpoints();

    expect(endpoints.get("service1/endpoint1")).toBeUndefined()
    expect(endpoints.get("service1/service2/endpoint1")).toEqual(dummyEndpoint1)
    expect(endpoints.get("service1/endpoint2")).toEqual(dummyEndpoint2)
})

test('Does not allow circular service structure', () => {
    const svc1 = new Service("service1");
    const svc2 = new Service("service2");
    const svc3 = new Service("service3");

    svc2.addService(svc1);
    svc3.addService(svc2);

    expect(() => svc1.addService(svc1)).toThrow();
    expect(() => svc1.addService(svc2)).toThrow();
    expect(() => svc1.addService(svc3)).toThrow();
});

test('Applies plugins to all current endpoints', () => {
    const svc = new Service("service1");
    const plugin = new DummyPlugin();
    const endpoint1 = new DummyEndpoint();
    const endpoint2 = new DummyEndpoint();

    svc.addEndpoint("endpoint1", endpoint1);
    svc.addPlugin(plugin);
    svc.addEndpoint("endpoint2", endpoint2);
    expect(plugin.installTimeMock).toHaveBeenCalledTimes(1)

    const endpoints = svc.allEndpoints()
    endpoints.get("service1/endpoint1")?.handle(undefined as any)
    expect(plugin.runTimeMock).toHaveBeenCalledTimes(1)
    endpoints.get("service1/endpoint2")?.handle(undefined as any)
    expect(plugin.runTimeMock).toHaveBeenCalledTimes(1)

    // endpoint1 now has the plugin applied twice
    svc.addPlugin(plugin);
    expect(plugin.installTimeMock).toHaveBeenCalledTimes(3)

    endpoints.get("service1/endpoint1")?.handle(undefined as any)
    expect(plugin.runTimeMock).toHaveBeenCalledTimes(3)
    endpoints.get("service1/endpoint2")?.handle(undefined as any);
    expect(plugin.runTimeMock).toHaveBeenCalledTimes(4);
})
