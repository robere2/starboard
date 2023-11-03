import {JSONSchema4} from "json-schema";

export interface SchemaData {
    dtsOutDir?: string,
    schemaPath: string,
    defName: string,
    testUrls: string[] | (() => string[]) | (() => Promise<string[]>),
    dataPreprocess?: (input: any) => any,
    dataPostprocess?: (input: {responses: Record<string, any>, schema: JSONSchema4}) => void
}
