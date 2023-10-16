export interface IDeferPolicy {
    poll(): Promise<void>;
    update(res: Response): void;
}
