export class HypixelApiError extends Error {
    constructor(cause: string, url: string, options?: ErrorOptions) {
        super(
            `${cause}\n` +
            `URL: ${url}\n`,
            options
        );
    }
}
