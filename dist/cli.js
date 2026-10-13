#!/usr/bin/env node
import { getCurrentBranch, optimizeRepo, pruneBranches } from "./index.js";
const VERSION = "1.0.0";
const HELP = `
git-tidy — Zero-dependency git branch pruner & repo optimizer

Usage:
  git-tidy                 Preview merged & stale [gone] branches (dry run)
  git-tidy prune           Prune merged and stale local branches
  git-tidy gc              Run aggressive git garbage collection & optimize repo

Options:
  -f, --force              Force prune without confirmation
  --json                   Output results as JSON
  -v, --version            Display version
  -h, --help               Display help message

Examples:
  $ git-tidy
  $ git-tidy prune -f
  $ git-tidy gc
`;
async function main() {
    const args = process.argv.slice(2);
    if (args.includes("-h") || args.includes("--help")) {
        console.log(HELP);
        return;
    }
    if (args.includes("-v") || args.includes("--version")) {
        console.log(`git-tidy v${VERSION}`);
        return;
    }
    const current = getCurrentBranch();
    if (!current) {
        console.error("\x1b[31mError:\x1b[0m Not inside a git repository.");
        process.exit(1);
    }
    const json = args.includes("--json");
    const force = args.includes("-f") || args.includes("--force");
    const cmd = args.find(a => !a.startsWith("-")) || "dry-run";
    if (cmd === "gc") {
        console.log("Optimizing git repository (git gc --prune=now --aggressive)...");
        const out = optimizeRepo();
        console.log(out || "\x1b[32m✔\x1b[0m Repository optimized successfully.");
        return;
    }
    const isDryRun = cmd === "dry-run" && !force;
    const result = pruneBranches({ dryRun: isDryRun });
    if (json) {
        console.log(JSON.stringify(result, null, 2));
        return;
    }
    if (result.candidates.length === 0) {
        console.log("\x1b[32m✔\x1b[0m Repository is already tidy! No merged or stale [gone] branches found.");
        return;
    }
    if (isDryRun) {
        console.log(`\x1b[33mFound ${result.candidates.length} branch(es) ready to prune:\x1b[0m\n`);
        for (const b of result.candidates) {
            const reason = b.isGone ? "deleted on remote [gone]" : "merged into base";
            console.log(`  - \x1b[36m${b.name}\x1b[0m (${reason})`);
        }
        console.log(`\nRun \x1b[1mgit-tidy prune\x1b[0m or \x1b[1mgit-tidy prune -f\x1b[0m to delete them.`);
    }
    else {
        console.log(`\x1b[32m✔\x1b[0m Successfully pruned ${result.deleted.length} branch(es):`);
        for (const b of result.deleted) {
            console.log(`  - Deleted ${b}`);
        }
    }
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map