export interface IDeferPolicy {
    poll(req: Request | Response): Promise<void>;
}
