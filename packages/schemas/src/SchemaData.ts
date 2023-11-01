export interface SchemaData {
    dtsOutDir: string,
    schemaPath: string,
    defName: string,
    testUrls: string[] | (() => string[]) | (() => Promise<string[]>),
    dataPreprocess?: (input: any) => any
}
