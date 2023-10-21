import {IncomingMessage, Server} from "http";
import * as http from "http";

export type ServeOptions = {
    hostname: string;
    port: number;
    allowedHosts: string[];
    https: boolean;
}

function incomingMessageBody(req: IncomingMessage): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        const data: Buffer[] = [];
        req
            .on("data", (chunk) => {
                data.push(chunk);
            })
            .on('error', reject)
            .on('end', () => {
                if(data.length === 0) {
                    resolve(undefined);
                } else {
                    resolve(Buffer.concat(data).toString());
                }
            });
    })
}

async function incomingMessageToRequest(message: IncomingMessage, opts?: ServeOptions): Promise<Request | null> {
    if(!message.url) {
        return null;
    }
    const headers = new Headers();
    for(const [key, value] of Object.entries(message.headers)) {
        if(typeof value === "string") {
        } else if(Array.isArray(value)) {
            for(const v of value) {
                headers.append(key, v);
            }
        }
    }
    let url: string;
    if(opts?.https) {
        url = `https://${message.headers.host}${message.url}`
    } else {
        url = `http://${message.headers.host}${message.url}`
    }
    return new Request(url, {
        method: message.method,
        headers: headers,
        body: await incomingMessageBody(message)
    });
}

export async function serve(cb: (req: Request) => Promise<Response> | Response, opts?: ServeOptions): Promise<Server> {
    const server = http.createServer(async (nodeReq, nodeRes) => {
        const req = await incomingMessageToRequest(nodeReq, opts);
        if(!req) {
            nodeRes.writeHead(400);
            nodeRes.end();
            return;
        }

        const url = new URL(req.url);
        const allowedHosts = opts?.allowedHosts ?? [];
        if(!allowedHosts.includes(url.hostname)) {
            nodeRes.writeHead(403);
            nodeRes.end();
            return;
        }

        const res = await cb(req);

        for(const [key, value] of res.headers.entries()) {
            nodeRes.setHeader(key, value);
        }
        nodeRes.statusCode = res.status;
        nodeRes.statusMessage = res.statusText;
        nodeRes.end(await res.text());
    });

    return new Promise((resolve) => {
        server.listen(opts?.port ?? 8080, opts?.hostname ?? "localhost", () => {
            resolve(server);
        });
    })
}
