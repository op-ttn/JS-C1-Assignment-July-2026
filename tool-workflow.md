# Tool Workflow (Part A)

Primary AI tool: **Cursor** (agent + project rules).

## 1. Primary AI tool used

Cursor Desktop with an agent that can edit the repo, run shell commands, and follow project rules. Persistent context lives in `.cursor/rules/project.mdc` and `docs/`.

## 2. How I provide project context

- **Always-on rules:** stack (JS ESM, React/Vite, Express, Prisma/SQLite), Core-only scope, API shapes, state-machine rules, no secrets.
- **Planning docs:** `docs/functional-requirements.md`, `entities.md`, `api-endpoints.md`, `implementation-plan.md`, `questions-and-ambiguities.md`.
- **Milestone prompts:** “Implement Milestone N only… Stop when exit criteria are met” so the agent does not jump ahead.
- **Tool-specific folder:** `tool-specific/cursor-workflow/` (project context, spec, tasks, acceptance criteria, rules summary).

## 3. Requirement analysis

I asked the agent to derive FRs/NFRs, entities, API contract, and open questions from the assessment brief, then locked defaults (acting-user picker, priorities, terminal-ticket rules, SQLite) in `docs/questions-and-ambiguities.md` so later milestones did not re-litigate product decisions.

## 4. Planning and design

Architecture and milestone map were written before heavy coding (`docs/proposed-architecture.md`, `docs/implementation-plan.md`). Design choices called out early: pure `stateMachine` module, separate `POST .../status`, Zod on the backend, `allowedTransitions` on detail responses.

## 5. Code generation

Implementation proceeded **one milestone at a time** (M0→M7). Prompts constrained scope (“do not start M+1”, “no Stretch”). Generated code was expected to match existing folder layout and ESLint patterns.

## 6. How I validate AI-generated code

- Run the milestone’s exit-criteria commands (`curl`, `npm test`, browser flows).
- Reject suggestions that pull in Stretch (auth, OpenAPI, Docker) or TypeScript.
- Prefer smallest diff; ask before new libraries (only approved packages from the plan).
- Spot-check state-machine edges and terminal-ticket PATCH blocking.

## 7. Testing with AI

Milestone 4 focused exclusively on mandatory SM integration tests (valid + invalid transitions) against an isolated test DB. I treated “tests pass” as a gate before UI milestones (M5–M6).

## 8. Debugging with AI

Incidents (e.g. Prisma version vs Node 18, SQLite case-sensitive `contains`, EMFILE with `node --watch`) were investigated with logs/docs, then fixed with pinned versions, raw `LIKE` lowercasing, or plain `node` for backend `dev`. Captured in [debugging-notes.md](./debugging-notes.md) and `ai-prompts/debugging.md`.

## 9. Code review with AI

After Core features landed, I used structured review prompts against domain rules (status only via SM endpoint, terminal edits blocked, error shape). Accepted fixes that aligned with the contract; rejected drive-by refactors. See [code-review-notes.md](./code-review-notes.md) and [review-fixes.md](./review-fixes.md).

## 10. What I avoid sharing with AI

- Secrets, tokens, passwords, private keys, production credentials.
- Real customer PII (use seed/example users only).
- Internal non-project documents unrelated to this exercise.
- `.env` contents beyond the already-public `.env.example` shape.

## 11. Reusing this workflow on a real project

1. Write requirements + locked decisions before coding.  
2. Put stack and domain invariants in Cursor rules.  
3. Implement in vertical milestones with exit criteria.  
4. Keep a pure domain module for high-risk rules (here: status SM) and test it via HTTP.  
5. Maintain prompt history by activity; reflect honestly on what AI got wrong.  
6. Treat Stretch as optional evidence only after Core + artifacts are solid.
