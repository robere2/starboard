import assert from "node:assert/strict";
import {Mock, mock, test} from "node:test";
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
        this.installTimeMock = mock.fn(() => {})
        this.runTimeMock = mock.fn(() => {})
    }

    install(fn: Executor["handle"]): Executor["handle"] {
        this.installTimeMock();
        return (req) => {
            this.runTimeMock();
            return fn(req);
        }
    }

}

test('Correctly parses the path', () => {
    let svc = new Service("testing")
    assert.equal(svc.path, "testing")
    svc = new Service("multi/directory/paths")
    assert.equal(svc.path, "multi/directory/paths")
    svc = new Service("allows/ending/slash/")
    assert.equal(svc.path, "allows/ending/slash/")
    svc = new Service("empty//dirs///here")
    assert.equal(svc.path, "empty/dirs/here")
    svc = new Service("")
    assert.equal(svc.path, ".")
    svc = new Service(".")
    assert.equal(svc.path, ".")
    svc = new Service("test/..")
    assert.equal(svc.path, ".")
    svc = new Service("test/123/..")
    assert.equal(svc.path, "test")
    svc = new Service("test/./123")
    assert.equal(svc.path, "test/123")
    assert.throws(() => new Service(".."))
    assert.throws(() => new Service("test/../.."))

    svc.destroy();
})

test('Keeps track of subservices',  () => {
    const svc = new Service("service1")
    svc.addService(new Service("service2"))
    svc.addService(new Service("service3"))
    svc.addService(new Service("service4"))

    const subservices = svc.getServices();
    assert.equal(subservices.length, 3)

    const service1Count = subservices.filter(s => s.path === "service2").length
    assert.equal(service1Count, 1)
    const service2Count = subservices.filter(s => s.path === "service3").length
    assert.equal(service2Count, 1)
    const service3Count = subservices.filter(s => s.path === "service4").length
    assert.equal(service3Count, 1)

    svc.destroy();
})

test('Does not allow direct editing of the services array', () => {
    const svc = new Service("service1")
    svc.addService(new Service("service2"))
    svc.addService(new Service("service3"))
    svc.getServices().push(new Service("service4"))
    assert.equal(svc.getServices().length, 2)

    svc.destroy();
})

test('ownEndpoints returns a map of its own endpoints, and own endpoints only', () => {
    const dummyEndpoint1 = new DummyEndpoint();
    const dummyEndpoint2 = new DummyEndpoint();
    const svc = new Service("service1")
    svc.addService(new Service("service2").addEndpoint("endpoint1", dummyEndpoint1))
    svc.addEndpoint("endpoint2", dummyEndpoint2)

    const endpoints = svc.ownEndpoints();

    assert.equal(endpoints.get("service1/endpoint1"), undefined);
    assert.equal(endpoints.get("service1/service2/endpoint1"), undefined);
    assert.equal(endpoints.get("service1/endpoint2"), dummyEndpoint2)

    svc.destroy();
})

test('allEndpoints returns a map of its own endpoints and all subservice endpoints', () => {
    const dummyEndpoint1 = new DummyEndpoint();
    const dummyEndpoint2 = new DummyEndpoint();
    const svc = new Service("service1")
    svc.addService(new Service("service2").addEndpoint("endpoint1", dummyEndpoint1))
    svc.addEndpoint("endpoint2", dummyEndpoint2)

    const endpoints = svc.allEndpoints();

    assert.equal(endpoints.get("service1/endpoint1"), undefined);
    assert.equal(endpoints.get("service1/service2/endpoint1"), dummyEndpoint1)
    assert.equal(endpoints.get("service1/endpoint2"), dummyEndpoint2)

    svc.destroy();
})

test('Does not allow circular service structure', () => {
    const svc1 = new Service("service1");
    const svc2 = new Service("service2");
    const svc3 = new Service("service3");

    svc2.addService(svc1);
    svc3.addService(svc2);

    assert.throws(() => svc1.addService(svc1));
    assert.throws(() => svc1.addService(svc2));
    assert.throws(() => svc1.addService(svc3));
    svc1.destroy();
});

test('Applies plugins to all current endpoints', () => {
    const svc = new Service("service1");
    const plugin = new DummyPlugin();
    const endpoint1 = new DummyEndpoint();
    const endpoint2 = new DummyEndpoint();

    svc.addEndpoint("endpoint1", endpoint1);
    svc.addPlugin(plugin);
    svc.addEndpoint("endpoint2", endpoint2);
    assert.equal(plugin.installTimeMock.mock.calls.length, 1)

    const endpoints = svc.allEndpoints()
    endpoints.get("service1/endpoint1")?.handle(undefined as any)
    assert.equal(plugin.runTimeMock.mock.calls.length, 1)
    endpoints.get("service1/endpoint2")?.handle(undefined as any)
    assert.equal(plugin.runTimeMock.mock.calls.length, 1)

    // endpoint1 now has the plugin applied twice
    svc.addPlugin(plugin);
    assert.equal(plugin.installTimeMock.mock.calls.length, 3)

    endpoints.get("service1/endpoint1")?.handle(undefined as any)
    assert.equal(plugin.runTimeMock.mock.calls.length, 3)
    endpoints.get("service1/endpoint2")?.handle(undefined as any);
    assert.equal(plugin.runTimeMock.mock.calls.length, 4)

    svc.destroy();
})
