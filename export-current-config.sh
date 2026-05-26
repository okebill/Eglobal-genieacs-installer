#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="${ROOT_DIR}/db"
COLLECTIONS=(config provisions virtualParameters presets permissions)

if ! command -v mongodump >/dev/null 2>&1; then
  echo "mongodump not found" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

for collection in "${COLLECTIONS[@]}"; do
  echo "Exporting ${collection}"
  mongodump --db genieacs --collection "$collection" --out "$OUT_DIR"

  if [ -f "${OUT_DIR}/genieacs/${collection}.bson" ]; then
    mv "${OUT_DIR}/genieacs/${collection}.bson" "${OUT_DIR}/${collection}.bson"
  fi
  if [ -f "${OUT_DIR}/genieacs/${collection}.metadata.json" ]; then
    mv "${OUT_DIR}/genieacs/${collection}.metadata.json" "${OUT_DIR}/${collection}.metadata.json"
  fi
done

rm -rf "${OUT_DIR}/genieacs"

cat <<'MSG'

Export completed in ./db.

WARNING:
The exported .bson files may contain ACS credentials, UI users, and custom config.
They are ignored by .gitignore and should not be committed to a public repository.

To restore these local private dumps later:
  sudo RESTORE_DUMPS=1 ACS_PASS='...' CONN_REQ_PASS='...' bash install-params.sh

MSG
