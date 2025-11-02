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

echo "2) Start Katana in background (open a dedicated terminal is recommended)"
echo "Run: katana --disable-fee --allowed-origins '*'"

echo "3) Deploy contracts"
sozo migrate apply || { echo "Migration failed"; exit 1; }

echo "4) Start Torii (replace WORLD_ADDRESS as printed by migration)"
echo "Run: torii --world 0x<WORLD_ADDRESS> --rpc http://localhost:5050 --allowed-origins '*'"

echo "5) Start frontend"
cd frontend || exit 1
npm ci
echo "Edit frontend/.env with VITE_WORLD_ADDRESS and VITE_RPC_URL before running dev server if needed"
npm run dev
