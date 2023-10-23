import { defineLoader } from 'vitepress'
import {readFileSync} from "fs";

export interface Versions {
    api: string
    cli: string
    framework: string
}

declare const data: Versions
export { data }

export default defineLoader({
    watch: ['../../../apps/*/package.json', '../../../packages/*/package.json'],
    async load(watchedFiles): Promise<Versions> {
        const partialVersions: Partial<Versions> = {};

        for(const file of watchedFiles) {
            const packageJson = JSON.parse(readFileSync(file, 'utf-8'));
            switch (packageJson.name) {
                case "@mcsb/api":
                    partialVersions.api = packageJson.version
                    break;
                case "@mcsb/cli":
                    partialVersions.cli = packageJson.version
                    break;
                case "@mcsb/framework":
                    partialVersions.framework = packageJson.version
                    break;
            }
        }

        return {
            api: partialVersions.api ?? 'latest',
            cli: partialVersions.cli ?? 'latest',
            framework: partialVersions.framework ?? 'latest',
        }
    }
})
