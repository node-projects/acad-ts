# Repository memory

This folder stores durable project conventions and decisions that future work in this repository must follow.

## ACadSharp upstream synchronization

- Review ACadSharp in chronological/topological commit order from the last compared SHA.
- For every applicable upstream commit, create a corresponding local Git commit immediately after converting and verifying it.
- Put the full upstream SHA in the local commit message, using `ACadSharp: <upstream subject> (<sha>)` where practical.
- Do not combine independent upstream commits into one local feature commit merely because they touch the same files.
- Do not create empty commits for upstream merges, release bumps, C#-only refactors, tests, or documentation that require no TypeScript change; record those as reviewed/no-op in the audit instead.
- Update the last-compared SHA only after every preceding upstream commit has been reviewed and its applicable local commit has been created.
- Never push these synchronization commits unless the user explicitly asks.

The detailed comparison ledger is maintained in [`docs/acadsharp-upstream-sync.md`](../docs/acadsharp-upstream-sync.md).
