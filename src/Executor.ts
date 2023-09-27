export interface Executor {
    handle(req: Request): Response | Promise<Response>
}
