#!/usr/bin/env bash
# 차량 스냅샷까지 포함해 Storybook을 다시 빌드하고 0.0.0.0:6106 으로 서비스한다.
set -euo pipefail
cd "$(dirname "$0")/.."
nice -n 19 bun run sb:build
exec bun scripts/serve-static.ts storybook-static "${PORT:-6106}" 0.0.0.0
