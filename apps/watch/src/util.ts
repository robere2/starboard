import {Package} from "@manypkg/get-packages";

export function getPackageScripts(pkg: Package): Record<string, string> {
    const jsonAsAny = pkg.packageJson as any;
    return jsonAsAny?.scripts ?? {};
}
