import type { BranchInfo, PruneResult } from "./types.js";
export * from "./types.js";
export declare function getCurrentBranch(): string;
export declare function getDefaultBranch(): string;
export declare function listBranches(baseBranch?: string): BranchInfo[];
export declare function pruneBranches(options?: {
    force?: boolean;
    dryRun?: boolean;
    base?: string;
}): PruneResult;
export declare function optimizeRepo(): string;
//# sourceMappingURL=index.d.ts.map