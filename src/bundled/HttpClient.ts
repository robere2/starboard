export class HttpClient {
    fetch(url: string | URL | Request, init?: FetchRequestInit): Promise<Response>;
    fetch(input: Request, init?: RequestInit): Promise<Response>;
    fetch(input: any, init?: any): Promise<Response> {
        return fetch(input, init);
    }
}
