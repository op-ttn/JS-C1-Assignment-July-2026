# Final AI Usage Summary

## Tool

**Cursor** (agent + `.cursor/rules/project.mdc` + `docs/` + `tool-specific/cursor-workflow/`).

## Lifecycle coverage

| Activity | Evidence |
| --- | --- |
| Requirements | `requirements-analysis.md`, `docs/functional-requirements.md` |
| Planning | `implementation-plan.md`, `docs/implementation-plan.md` |
| Design | `design-notes.md`, `api-contract.md`, `data-model.md`, `ui-flow.md` |
| Implementation | `ai-prompts/implementation.md` (M0–M7) |
| Testing | `test-strategy.md`, `test-results.md`, `ai-prompts/testing.md` |
| Debugging | `debugging-notes.md`, `ai-prompts/debugging.md` |
| Code review | `code-review-notes.md`, `review-fixes.md`, `ai-prompts/code-review.md` |
| Documentation | This package + `ai-prompts/documentation.md` |
| Reflection | `reflection.md`, `tool-workflow.md` |

## How prompting was structured

- Milestone-scoped: “Implement Milestone N only… Stop when exit criteria are met.”
- Context via rules + planning docs (not one-line “make an app” prompts).
- Iteration when environment constraints appeared (Node 18 pins, SQLite search).
- Explicit rejection of Stretch during Core milestones.

## Responsible use

- No secrets, tokens, or production credentials shared or committed.
- Seed/example users only.
- Human ownership of SM rules, acceptance criteria, and final artifact honesty.

## Outcome

Core application is runnable from the README; mandatory SM tests pass; assessment repository structure is populated; Stretch remains clearly future work.
