#!/usr/bin/env bash
# Run local demo: start katana, deploy, start torii, and run frontend dev server
# NOTE: This script is a convenience helper. Run interactively in separate terminals when needed.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR" || exit 1

echo "1) Check sozo"
if ! command -v sozo >/dev/null 2>&1; then
  echo "sozo not found. Install Dojo: curl -L https://install.dojoengine.org | bash && dojoup"
  exit 1
fi

DEMO_ONLY=false
if [ "$1" = "--demo" ] || [ "$1" = "demo" ]; then
  DEMO_ONLY=true
fi

echo "2) Start Katana in background (open a dedicated terminal is recommended)"
echo "Run: katana --disable-fee --allowed-origins '*'"

if [ "$DEMO_ONLY" = false ]; then
  echo "3) Deploy contracts"
  sozo migrate apply || { echo "Migration failed"; echo "You can run the script with --demo to skip blockchain deploy."; exit 1; }

  echo "4) Start Torii (replace WORLD_ADDRESS as printed by migration)"
  echo "Run: torii --world 0x<WORLD_ADDRESS> --rpc http://localhost:5050 --allowed-origins '*'"
else
  echo "Skipping contract deploy & Torii: running in DEMO mode"
fi

echo "5) Start frontend"
cd frontend || exit 1
npm ci
if [ "$DEMO_ONLY" = true ]; then
  echo "Running frontend in DEMO MODE (no VITE_WORLD_ADDRESS required)."
  # Remove or unset world address to force demo mode
  cp .env.example .env.local 2>/dev/null || true
  sed -i "s/^VITE_WORLD_ADDRESS=.*$/VITE_WORLD_ADDRESS=/" .env.local || true
fi
echo "Edit frontend/.env(.local) with VITE_WORLD_ADDRESS and VITE_RPC_URL if needed"
npm run dev
