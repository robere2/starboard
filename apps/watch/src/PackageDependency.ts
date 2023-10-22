import {Package, Packages} from "@manypkg/get-packages";
import { PackageJSON } from "@manypkg/tools";

const dependencyCache: Map<string, Package[]> = new Map<string, Package[]>()

export class PackageDependency implements Package {

    private readonly pkg: Package;
    public readonly dependencies: Set<Package> = new Set();
    public readonly allDependencies: Set<Package> = new Set();


    constructor(pkg: Package, root: Packages) {
        this.pkg = pkg;
        for(const dep of PackageDependency.getDependencies(pkg, root)) {
            this.dependencies.add(dep);
            this.allDependencies.add(dep);
            for(const subDep of PackageDependency.getDependencies(dep, root)) {
                this.allDependencies.add(subDep);
            }
        }
    }

    public get dir(): string {
        return this.pkg.dir;
    }

    public get packageJson(): PackageJSON {
        return this.pkg.packageJson;
    }

    public get relativeDir(): string {
        return this.pkg.relativeDir;
    }

    private static getDependencies(pkg: Package, root: Packages): Package[] {
        if(dependencyCache.has(pkg.dir)) {
            return dependencyCache.get(pkg.dir)!;
        }

        const allDeps = {
            ...pkg.packageJson.dependencies,
            ...pkg.packageJson.devDependencies,
            ...pkg.packageJson.peerDependencies,
            ...pkg.packageJson.optionalDependencies
        }

        // Get deps from package.json, find their corresponding local package, and filter out anything left thats
        //   undefined (i.e., probably not a local package)
        const dependencies = Object.entries(allDeps)
            .map(([name]) => {
                return root.packages.find(p => p.packageJson.name === name)
            })
            .filter((p): p is Package => {
                return p !== undefined
            })

        dependencyCache.set(pkg.dir, dependencies);
        return dependencies;
    }
}
