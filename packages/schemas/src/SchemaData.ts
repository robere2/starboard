import {LoadedSchemaData} from "./tools";

export interface SchemaData {
    dtsOutDir?: string,
    schemaPath: string,
    defName: string,
    testUrls: string[] | (() => string[]) | (() => Promise<string[]>),
    dataPreprocess?: (input: any) => any,
    dataPostprocess?: (input: {responses: Record<string, any>} & LoadedSchemaData) => void
}
