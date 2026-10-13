<div align="center">

# git-tidy

**Zero-dependency CLI tool to prune merged & stale git branches and optimize repositories.**

[![npm version](https://img.shields.io/npm/v/git-tidy?style=flat-square&color=58a6ff)](https://www.npmjs.com/package/git-tidy)
[![license](https://img.shields.io/github/license/xxnetme/git-tidy?style=flat-square&color=3fb950)](LICENSE)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square)](#)
[![node](https://img.shields.io/badge/node-%3E%3D18.0.0-blue?style=flat-square)](https://nodejs.org)

<br/>

Safely clean up merged and gone git branches, remove stale remote references, and compress git object databases with one command.

```bash
npx git-tidy
npx git-tidy prune -f
```

</div>

---

### Features

* **Safe Branch Deletion:** Automatically protects `main`, `master`, `dev`, `develop`, `production`, and the current branch.
* **Remote Tracking Clean:** Fetches with `--prune` and identifies local branches whose upstream was deleted (`: gone]`).
* **Dry Run by Default:** Inspect what will be removed before performing any destructive actions.
* **Repo Optimizer:** Compresses and repacks your `.git` object store with `git-tidy gc`.

---

### CLI Usage

#### 1. Dry run (preview branches to prune)
```bash
npx git-tidy
```

#### 2. Prune merged & stale branches
```bash
npx git-tidy prune -f
```

#### 3. Optimize repository storage
```bash
npx git-tidy gc
```

---

### Programmatic API

```ts
import { pruneBranches, listBranches } from "git-tidy";

// Get list of all branches with merged & gone status
const branches = listBranches();
console.log(branches);

// Prune candidates
const result = pruneBranches({ dryRun: false });
console.log(`Pruned ${result.deleted.length} branches`);
```

---

### License

MIT License (c) 2026 [xxnetme](https://github.com/xxnetme)
