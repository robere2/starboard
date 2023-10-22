import assert from "node:assert/strict"
import {afterEach, beforeEach, describe, Mock, mock, test} from "node:test";
import {Starboard} from "./Starboard";
import {Service} from "./Service";
import {Endpoint} from "./Endpoint";
import {ServeOptions} from "./serve";

class DummyEndpoint extends Endpoint {
    public mock: Mock<() => void> = mock.fn(() => {});
    async handle(req: Request): Promise<Response> {
        this.mock();
        return new Response(JSON.stringify({url: req.url}))
    }
}

describe("Structure", () => {

    let sb: Starboard;
    beforeEach(() => {
        createNewStarboard()
    })

    afterEach(async () => {
        if(sb?.isRunning()) {
            await sb.stop()
        }
    })

    function createNewStarboard(options?: ServeOptions) {
        if(sb?.isRunning()) {
            sb.stop()
        }
        sb = new Starboard(options);
    }

    test('Starts the server', async () => {
        await sb.start()
    })

    test('Accepts port and hostname', async () => {
        createNewStarboard({
            port: 8080,
            hostname: "0.0.0.0",
        })
        await sb.start()
        assert.equal(sb.getPort(), 8080)
        assert.equal(sb.getHostname(), "0.0.0.0");
    })

    test('Knows if the server is running', async () => {
        assert.equal(sb.isRunning(), false)
        await sb.start()
        assert.equal(sb.isRunning(), true)
        await sb.stop()
        assert.equal(sb.isRunning(), false)
    })

    test('Stops the server', async () => {
        await sb.start()
        await sb.stop()
    })

    test('Does not allow server to start twice', async () => {
        await sb.start()
        assert.rejects(sb.start())
    })

    test('Does not allow server to stop twice', async () => {
        await sb.start()
        await sb.stop()
        assert.rejects(sb.stop())
    })

    test('Does not provide port or hostname if server is offline', () => {
        assert.throws(() => sb.getPort())
        assert.throws(() => sb.getHostname())
    })
})

describe("HTTP", () => {

    test("Starts an HTTP server", async () => {
        const sb = new Starboard({
            port: 0
        });

        assert.equal(sb.getServer(), undefined)
        await sb.start()
        assert.notEqual(sb.getServer(), undefined)
        const port = sb.getPort()

        const response = await fetch(`http://localhost:${port}`)
        assert.equal(response.status, 404);

        await sb.stop();
    })

    test("Properly resolves endpoint paths", async () => {
        const sb = new Starboard({
            port: 0
        });

        const dummyEndpoint1 = new DummyEndpoint();
        const dummyEndpoint2 = new DummyEndpoint();
        sb.addService(
            new Service("service1")
                .addEndpoint("endpoint1", dummyEndpoint1)
                .addEndpoint("endpoint2", dummyEndpoint2)
        )
        sb.addEndpoint("endpoint3", dummyEndpoint1)
        sb.addEndpoint("endpoint4", dummyEndpoint1)

        await sb.start()
        const port = sb.getPort()
        const url = `http://localhost:${port}`;

        const response = await fetch(`${url}/service1/endpoint1`)
        assert.equal(response.status, 200);
        assert.deepEqual(await response.json(), {url: `${url}/service1/endpoint1`})

        const response2 = await fetch(`${url}/service1/endpoint2`)
        assert.equal(response2.status, 200);
        assert.deepEqual(await response2.json(), {url: `${url}/service1/endpoint2`})

        const response3 = await fetch(`${url}/endpoint3`)
        assert.equal(response3.status, 200);
        assert.deepEqual(await response3.json(), {url: `${url}/endpoint3`})

        const response4 = await fetch(`${url}/endpoint4`)
        assert.equal(response4.status, 200);
        assert.deepEqual(await response4.json(), {url: `${url}/endpoint4`})

        assert.equal(dummyEndpoint1.mock.mock.calls.length, 3);
        assert.equal(dummyEndpoint2.mock.mock.calls.length, 1);

        await sb.stop();
    })
})
