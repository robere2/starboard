import {afterEach, beforeEach, describe, expect, Mock, mock, test} from "bun:test";
import {Starboard} from "./Starboard";
import {Service} from "./Service";
import {Endpoint} from "./Endpoint";

class DummyEndpoint extends Endpoint {
    public mock: Mock<() => void> = mock(() => {});
    async handle(req: Request): Promise<Response> {
        this.mock();
        return new Response(JSON.stringify({url: req.url}))
    }
}

describe("Structure", () => {

    let sb: Starboard;
    beforeEach(() => {
        sb = new Starboard();
    })

    afterEach(() => {
        if(sb.isRunning()) {
            sb.stop()
        }
    })

    test('Starts the server', () => {
        sb.start()
    })

    test('Accepts port and hostname', () => {
        sb = new Starboard(8080, "0.0.0.0");
        sb.start()
        expect(sb.getPort()).toEqual(8080)
        expect(sb.getHostname()).toEqual("0.0.0.0");
    })

    test('Knows if the server is running', () => {
        expect(sb.isRunning()).toBeFalse()
        sb.start()
        expect(sb.isRunning()).toBeTrue()
        sb.stop()
        expect(sb.isRunning()).toBeFalse()
    })

    test('Stops the server', () => {
        sb.start()
        sb.stop()
    })

    test('Does not allow server to start twice', () => {
        sb.start()
        expect(() => sb.start()).toThrow()
    })

    test('Does not allow server to stop twice', () => {
        sb.start()
        sb.stop()
        expect(() => sb.stop()).toThrow()
    })

    test('Does not provide port or hostname if server is offline', () => {
        expect(() => sb.getPort()).toThrow()
        expect(() => sb.getHostname()).toThrow()
    })
})

describe("HTTP", () => {

    test("Starts an HTTP server", async () => {
        const sb = new Starboard(0);

        expect(sb.getServer()).toBeUndefined()
        sb.start()
        expect(sb.getServer()).not.toBeUndefined()
        const port = sb.getPort()

        const response = await fetch(`http://localhost:${port}`)
        expect(response.status).toEqual(404);

        sb.stop();
    })

    test("Properly resolves endpoint paths", async () => {
        const sb = new Starboard(0);

        const dummyEndpoint1 = new DummyEndpoint();
        const dummyEndpoint2 = new DummyEndpoint();
        sb.addService(
            new Service("service1")
                .addEndpoint("endpoint1", dummyEndpoint1)
                .addEndpoint("endpoint2", dummyEndpoint2)
        )
        sb.addEndpoint("endpoint3", dummyEndpoint1)
        sb.addEndpoint("endpoint4", dummyEndpoint1)

        sb.start()
        const port = sb.getPort()
        const url = `http://localhost:${port}`;

        const response = await fetch(`${url}/service1/endpoint1`)
        expect(response.status).toEqual(200);
        expect(await response.json()).toEqual({url: `${url}/service1/endpoint1`})

        const response2 = await fetch(`${url}/service1/endpoint2`)
        expect(response2.status).toEqual(200);
        expect(await response2.json()).toEqual({url: `${url}/service1/endpoint2`})

        const response3 = await fetch(`${url}/endpoint3`)
        expect(response3.status).toEqual(200);
        expect(await response3.json()).toEqual({url: `${url}/endpoint3`})

        const response4 = await fetch(`${url}/endpoint4`)
        expect(response4.status).toEqual(200);
        expect(await response4.json()).toEqual({url: `${url}/endpoint4`})

        expect(dummyEndpoint1.mock).toHaveBeenCalledTimes(3);
        expect(dummyEndpoint2.mock).toHaveBeenCalledTimes(1);

        sb.stop();
    })
})
