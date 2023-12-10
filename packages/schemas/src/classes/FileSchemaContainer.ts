import {AddUrlCallback, SchemaContainer} from "./SchemaContainer";
import {JSONSchema4} from "json-schema";
import {Options} from "ajv";
import fs from "fs";

export type FileSchemaContainerOptions = {
    ajvOptions: Options,
    path: string,
    addUrlCallback?: AddUrlCallback
}

export class FileSchemaContainer<T = unknown> extends SchemaContainer<T> {
    private readonly _path: string;
    private _schema: JSONSchema4;
    private addUrlCallback: AddUrlCallback;

    protected constructor(options: Options, path: string, schema: JSONSchema4, addUrlCallback?: AddUrlCallback) {
        super(options);
        this._path = path;
        this._schema = schema;
        this.addUrlCallback = addUrlCallback ?? (() => {});
    }

    /**
     * Creates a new FileSchemaContainer object and reads the file's contents.
     * The file must already exist and be a valid JSON schema.
     *
     * @param {FileSchemaContainerOptions} options - The options for creating the FileSchemaContainer.
     * @return {Promise<FileSchemaContainer<T>>} - A promise that is resolved with the newly created FileSchemaContainer object.
     * @throws
     * - `Error` on filesystem I/O error
     */
    public static async create<T = unknown>(options: FileSchemaContainerOptions): Promise<FileSchemaContainer<T>> {
        const contents = await fs.promises.readFile(options.path)
        return new FileSchemaContainer<T>(options.ajvOptions, options.path, JSON.parse(contents.toString()));
    }

    /**
     * @override
     * @param urls
     */
    public addUrl(...urls: string[]) {
        urls.forEach(url => this.addUrlCallback([url, this]))
        super.addUrl(...urls);
    }

    public set schema(val: JSONSchema4) {
        // Fast but not perfect if the objects' properties change order. Since our schemas are alphanumerically ordered,
        // this should be a non-issue.
        if(JSON.stringify(this._schema) !== JSON.stringify(val)) {
            this.resetCache();
        }
        this._schema = val;
    }

    public get schema() {
        return structuredClone(this._schema);
    }

    public get path() {
        return this._path;
    }

    public async save(): Promise<void> {
        await fs.promises.writeFile(this.path, JSON.stringify(this._schema, null, 2));
    }
}
