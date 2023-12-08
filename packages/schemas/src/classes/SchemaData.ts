import {JSONSchema4} from "json-schema";

export interface SchemaData {
    dtsOutDir?: string,
    schemaPath: string,
    defName: string,
    postProcess?: (input: Record<string, any>, addUrl: (url: [string, SchemaData]) => void) => Record<string, any> | Record<string, any>[]
}

export interface LoadedSchemaData extends SchemaData {
    schema: JSONSchema4,
    definition: JSONSchema4
}
