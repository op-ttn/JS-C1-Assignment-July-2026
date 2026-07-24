# Review Fixes

Fixes and follow-ups applied after implementation review (Milestone 7 polish).

## Applied

| Item | Change |
| --- | --- |
| README completeness | Full prerequisites, ports, scripts, verify steps, Stretch list |
| Acceptance checklist | Root `acceptance-criteria.md` marked against Core criteria |
| Test strategy | Promoted from draft to final Core scope wording |
| Secrets hygiene | Confirmed `.gitignore` covers `.env` and `*.db`; only `.env.example` committed |
| Cursor workflow folder | Filled `tool-specific/cursor-workflow/*` for assessment structure |
| Prompt history | Expanded `ai-prompts/` by activity (design, testing, debugging, review, docs) |
| Database handoff | Finalized `database/setup-notes.md`; added pointers for schema/seed locations |
| Clean `db:setup` | Include `prisma generate` so seed works after fresh `npm install` |

## Not applied (intentionally)

- Auth, pagination, OpenAPI, Docker, CI (Stretch)
- Additional unit/component test tiers (Stretch)
- Visual redesign beyond Core usability (optional polish not required for exit criteria)

## Verification after fixes

```bash
npm install
cp .env.example .env
npm run db:setup
npm run test
npm run dev
```
