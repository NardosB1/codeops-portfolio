# Addis Eats API — Make Every Failure Correct

## Acceptance Criteria
1. `starter/run-all.sh` matches `starter/expected.md` on all twelve bad requests.
2. Every error body carries the exact same five fields: `statusCode`, `message`, `path`, `timestamp`, `requestId`.
3. No response at any HTTP status contains a stack trace.
4. A deliberately forced `TypeError` returns a generic `500` with details logged server-side only.
5. `docs/api-standard.md` updated to reflect the five standardized error fields.

## Quick Start
```bash
npm install
npm run start:dev
```
In another terminal:
```bash
bash starter/run-all.sh
```
