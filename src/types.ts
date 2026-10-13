export interface BranchInfo {
    name: string;
    isCurrent: boolean;
    isMerged: boolean;
    isGone: boolean;
    lastCommitDate?: string;
    lastCommitMessage?: string;
}

export interface PruneResult {
    protectedBranches: string[];
    candidates: BranchInfo[];
    deleted: string[];
    dryRun: boolean;
}
