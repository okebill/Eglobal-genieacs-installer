#!/usr/bin/env bash
set -euo pipefail

BACKUP_ROOT="${BACKUP_ROOT:-./backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="${BACKUP_ROOT}/genieacs-full-${STAMP}"

if ! command -v mongodump >/dev/null 2>&1; then
  echo "mongodump not found" >&2
  exit 1
fi

mkdir -p "$BACKUP_ROOT"
mongodump --db genieacs --out "$OUT_DIR"

echo "Backup completed:"
echo "$OUT_DIR"
