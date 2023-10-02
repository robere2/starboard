
export const UUID_REGEX = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

export type ParsedOptions<T> = Readonly<{
    [P in keyof T]-?: T[P];
}>
