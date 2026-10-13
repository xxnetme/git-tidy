import { execSync } from "node:child_process";
export * from "./types.js";
const DEFAULT_PROTECTED = new Set(["main", "master", "dev", "develop", "production", "staging"]);
function runGit(cmd) {
    return execSync(`git ${cmd}`, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }).trim();
}
export function getCurrentBranch() {
    try {
        return runGit("branch --show-current");
    }
    catch {
        return "";
    }
}
export function getDefaultBranch() {
    try {
        const ref = runGit("symbolic-ref refs/remotes/origin/HEAD");
        return ref.replace("refs/remotes/origin/", "");
    }
    catch {
        return "main";
    }
}
export function listBranches(baseBranch) {
    const current = getCurrentBranch();
    const base = baseBranch || getDefaultBranch();
    // Fetch and prune remote tracking references
    try {
        runGit("fetch --prune");
    }
    catch {
        // offline or no remote
    }
    // Get merged branches
    const mergedOutput = runGit(`branch --merged ${base}`);
    const mergedSet = new Set(mergedOutput
        .split("\n")
        .map(b => b.replace(/^[\*\s]+/, "").trim())
        .filter(Boolean));
    // Get branch -vv to check gone
    const vvOutput = runGit("branch -vv");
    const branches = [];
    for (const line of vvOutput.split("\n")) {
        if (!line.trim())
            continue;
        const isCurrent = line.startsWith("*");
        const cleanLine = line.replace(/^[\*\s]+/, "");
        const parts = cleanLine.split(/\s+/);
        const name = parts[0];
        const isGone = line.includes(": gone]");
        const isMerged = mergedSet.has(name);
        branches.push({
            name,
            isCurrent,
            isMerged,
            isGone
        });
    }
    return branches;
}
export function pruneBranches(options = {}) {
    const current = getCurrentBranch();
    const base = options.base || getDefaultBranch();
    const branches = listBranches(base);
    const protectedList = new Set([...DEFAULT_PROTECTED, current, base]);
    const candidates = branches.filter(b => !protectedList.has(b.name) && (b.isMerged || b.isGone));
    const deleted = [];
    if (!options.dryRun) {
        for (const candidate of candidates) {
            try {
                runGit(`branch -D ${candidate.name}`);
                deleted.push(candidate.name);
            }
            catch {
                // skip failed
            }
        }
    }
    return {
        protectedBranches: Array.from(protectedList),
        candidates,
        deleted,
        dryRun: !!options.dryRun
    };
}
export function optimizeRepo() {
    return runGit("gc --prune=now --aggressive");
}
//# sourceMappingURL=index.js.map