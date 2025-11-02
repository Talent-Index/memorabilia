# Dojo Telegram SDK (prototype)

This folder contains a minimal prototype for a Dojo <-> Telegram SDK used in the Memorabilia sprint.

What it includes
- `src/auth.ts` — simple initData parsing helper (prototype only).
- `src/dojoClient.ts` — thin wrapper that calls world entrypoints via a provided Account.

How to use
1. Install TypeScript dev dep: `npm ci` in the sdk folder.
2. Build: `npm run build`.
3. Use the `DojoClient` wrapper with a live Account instance from your frontend runtime (create-burner or Account provider).

Notes
- This is a prototype scaffold. For production, add full initData validation (server-side), proper CallData encoding, and error handling.
