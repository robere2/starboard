export interface Executor {
    handle(req: Request): Promise<Response>
}
