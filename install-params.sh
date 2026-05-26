#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GENIEACS_NBI_URL="${GENIEACS_NBI_URL:-http://127.0.0.1:7557}"
ACS_USER="${ACS_USER:-acs}"
CONN_REQ_USER="${CONN_REQ_USER:-acs}"
INFORM_INTERVAL="${INFORM_INTERVAL:-200}"

green() { printf '\033[0;32m%s\033[0m\n' "$*"; }
red() { printf '\033[0;31m%s\033[0m\n' "$*" >&2; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    red "Required command not found: $1"
    exit 1
  fi
}

prompt_secret() {
  local var_name="$1"
  local label="$2"
  local current_value="${!var_name:-}"

  if [ -n "$current_value" ]; then
    return
  fi

  read -r -s -p "$label: " current_value
  printf '\n'
  export "$var_name=$current_value"
}

sed_escape() {
  printf '%s' "$1" | sed -e 's/[\/&]/\\&/g'
}

mongo_eval() {
  local js="$1"
  if command -v mongosh >/dev/null 2>&1; then
    mongosh --quiet genieacs --eval "$js"
  else
    mongo --quiet genieacs --eval "$js"
  fi
}

upload_raw_script() {
  local endpoint="$1"
  local id="$2"
  local file="$3"

  curl -fsS -X PUT \
    -H "Content-Type: text/plain" \
    --data-binary "@${file}" \
    "${GENIEACS_NBI_URL}/${endpoint}/${id}" >/dev/null
}

restore_private_dumps_if_requested() {
  if [ "${RESTORE_DUMPS:-0}" != "1" ]; then
    return
  fi

  require_cmd mongorestore

  local collections=(config provisions virtualParameters presets permissions)
  for collection in "${collections[@]}"; do
    local file="${ROOT_DIR}/db/${collection}.bson"
    if [ -f "$file" ]; then
      green "Restoring private dump: ${collection}"
      mongorestore --db genieacs --collection "$collection" --drop "$file"
    fi
  done
}

apply_virtual_parameters() {
  local vp_dir="${ROOT_DIR}/templates/virtual-parameters"
  local file
  local id

  shopt -s nullglob
  for file in "${vp_dir}"/*.js; do
    id="$(basename "$file" .js)"
    green "Installing virtual parameter: ${id}"
    upload_raw_script "virtual_parameters" "$id" "$file"
  done
  shopt -u nullglob
}

apply_inform_provision() {
  local tmp_file
  tmp_file="$(mktemp)"

  sed \
    -e "s/__INFORM_INTERVAL__/$(sed_escape "$INFORM_INTERVAL")/g" \
    -e "s/__ACS_USER__/$(sed_escape "$ACS_USER")/g" \
    -e "s/__ACS_PASS__/$(sed_escape "$ACS_PASS")/g" \
    -e "s/__CONN_REQ_USER__/$(sed_escape "$CONN_REQ_USER")/g" \
    -e "s/__CONN_REQ_PASS__/$(sed_escape "$CONN_REQ_PASS")/g" \
    "${ROOT_DIR}/templates/provisions/inform.js" > "$tmp_file"

  green "Installing provision: inform"
  upload_raw_script "provisions" "inform" "$tmp_file"
  rm -f "$tmp_file"
}

apply_ui_config_overlay() {
  green "Applying UI config overlay"

  mongo_eval '
function setConfig(id, value) {
  db.config.updateOne({_id: id}, {$set: {value: value}}, {upsert: true});
}

setConfig("ui.index.5.label", "'\''Pass'\''");
setConfig("ui.index.5.parameter", "VirtualParameters.WlanPassword");
setConfig("ui.index.6.label", "\"Active\"");
setConfig("ui.index.6.parameter", "VirtualParameters.activedevices");
setConfig("ui.index.0.parameters.14", "VirtualParameters.activedevices");
setConfig("ui.index.0.parameters.15", "VirtualParameters.WlanPassword");
setConfig("ui.index.0.parameters.16", "InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase");
'
}

restart_services() {
  if command -v systemctl >/dev/null 2>&1; then
    green "Restarting GenieACS services"
    systemctl restart genieacs-cwmp genieacs-fs genieacs-ui genieacs-nbi || true
  fi
}

main() {
  require_cmd curl
  require_cmd sed
  require_cmd mktemp

  if ! command -v mongosh >/dev/null 2>&1 && ! command -v mongo >/dev/null 2>&1; then
    red "Required command not found: mongosh or mongo"
    exit 1
  fi

  prompt_secret ACS_PASS "ACS management server password"
  prompt_secret CONN_REQ_PASS "Connection request password"

  restore_private_dumps_if_requested
  apply_virtual_parameters
  apply_inform_provision
  apply_ui_config_overlay
  restart_services

  green "Done. Eglobal GenieACS parameters installed."
}

main "$@"
