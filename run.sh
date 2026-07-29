#!/usr/bin/env bash
# ── Run the frontend without Docker ──────────────────────────────────
# Installs deps if needed then starts the Vite dev server on port 3000.
set -euo pipefail
cd "$(dirname "$0")"

echo "📦  Installing frontend dependencies…"
npm install

echo "🚀  Starting frontend on http://localhost:3000"
npm run build
exec node .output/server/index.mjs
