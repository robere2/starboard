import workerpool from "workerpool";
import {SchemaContainer} from "./classes/SchemaContainer";

function updateSchema<T extends SchemaContainer>(container: T, data: Record<string, any>[]): T {
    return container.update(data);
}

workerpool.worker({
    updateSchema
})
