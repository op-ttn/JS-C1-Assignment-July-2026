# AI prompts — code review

## 2026-07-23 — Core review against project rules

**Prompt (summary):** Review backend/frontend for: status only via SM endpoint; PATCH no status; terminal field edits blocked; comments allowed; error envelope; no secrets; tests isolated from `dev.db`. Do not add Stretch.

**AI response summary:** Confirmed SM purity and endpoint separation; noted documentation gaps for assessment structure; warned against drive-by refactors.

**Accepted:** Documentation and artifact completion as primary M7 work; keep SM rules frozen after M4.

**Changed:** Filled missing root markdown artifacts and Cursor workflow folder.

**Rejected:** Auth, OpenAPI, broad test expansion, TypeScript migration.
