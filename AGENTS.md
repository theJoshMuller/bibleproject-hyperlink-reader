# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

Use Beads CLI **1.0.3 or newer**. Older 0.x instructions may mention `bd sync`; that command is not part of the current embedded-mode workflow.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd export -o .beads/issues.jsonl      # Refresh git-tracked issue export when needed
bd preflight --check  # Check repo/beads readiness before push
```

## Landing the Plane (Session Completion)

When ending a work session:

1. File bd issues for remaining follow-up work.
2. Run relevant quality gates if files changed.
3. Update bd issue status for work you actually performed.
4. Refresh `.beads/issues.jsonl` when issue state changed: `bd export -o .beads/issues.jsonl`.
5. Commit completed work together with `.beads/issues.jsonl`.
6. If this session was explicitly responsible for landing changes and a remote is configured, run:
   ```bash
   git pull --rebase
   bd preflight --check
   git push
   git status
   ```
7. If the task is review-only, no files changed, or pushing was not delegated, do not create commits or push; report findings instead.
