import {afterEach, beforeEach, expect, test} from "bun:test";
import {Starboard} from "./Starboard.ts";

const validUuid = 'ca2db850-02ee-4b39-a18f-44656d182791';

let sb: Starboard;
beforeEach(() => {
    sb = new Starboard(validUuid);
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
    sb = new Starboard(validUuid, 8080, "0.0.0.0");
    sb.start()
    expect(sb.getPort()).toEqual(8080)
    expect(sb.getHostname()).toEqual("0.0.0.0");
})

test('Does not accept invalid UUIDs', () => {
    expect(() => new Starboard('This is not a valid UUID')).toThrow()
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
