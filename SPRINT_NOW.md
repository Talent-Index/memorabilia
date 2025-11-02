# 12-hour Sprint — Memorabilia: Dojo + Telegram Integration

Sprint goal
- Deliver a working local demo of Memorabilia on Dojo (Katana + Torii), Telegram Mini App local test (ngrok), and a minimal Dojo-Telegram SDK prototype.

Team (6 devs)
- Dev A — Contracts (Cairo/Dojo)
- Dev B — DevOps / Deployment (Katana/Torii)
- Dev C — Frontend (React / Dojo client)
- Dev D — Telegram integration / Mini App
- Dev E — SDK (Dojo-Telegram SDK prototype)
- Dev F — QA / Docs / Demo

Schedule & Tasks
- T+00:00 — Kickoff (5m): Quick sync, share bot token privately, post any local constraints.

1) Contracts build & test — Dev A (1.5h)
- Run `sozo build` and `sozo test`. Fix blocking failures for game/account/leaderboard tests.
- DoD: build passes and critical tests green.

2) Local deployment & indexer — Dev B (1h)
- Start Katana, deploy with `sozo migrate apply`, start Torii for World address.
- DoD: World address posted, Torii reachable.

3) Frontend blockchain integration — Dev C (2h)
- Configure `frontend/.env`, run `npm ci && npm run dev`, verify `setupDojo()` and burner flows.
- DoD: frontend logs show BLOCKCHAIN MODE and game transactions appearing in Torii.

4) Telegram Mini App test — Dev D (1.5h)
- Start ngrok, update BotFather web app URL, open bot in Telegram and verify `initTelegramApp()`.
- DoD: Mini App opens and frontend detects Telegram user.

5) SDK prototype — Dev E (2.5h)
- Scaffold `dojo-telegram-sdk/` with auth and Dojo client stubs and an example that calls `start_game`.
- DoD: `npm ci && npm run build` succeeds and example can run against local World (or is documented to use burner account).

6) QA, docs, demo recording — Dev F (2h)
- Produce runbook and demo video/GIF showing the demo.
- DoD: README snippet that reproduces the demo and a short recorded clip.

Coordination
- Standups at T+0h, T+3h, T+6h, T+9h (5 minutes).
- Post World address and `.env.local` after deployment to the shared channel.

Fallbacks
- If Dojo tooling is missing, run frontend in DEMO MODE and use mocks for SDK and Telegram flows. Flag testnet deployment as post-deadline work.

Artifacts created during sprint
- `SPRINT_NOW.md` (this file)
- `dojo-telegram-sdk/` scaffold
- `scripts/run_local_demo.sh` automation
