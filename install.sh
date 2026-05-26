#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GENIEACS_VERSION="${GENIEACS_VERSION:-1.2.16}"

green() { printf '\033[0;32m%s\033[0m\n' "$*"; }
red() { printf '\033[0;31m%s\033[0m\n' "$*" >&2; }

if [ "$(id -u)" -ne 0 ]; then
  red "Please run as root: sudo bash install.sh"
  exit 1
fi

detect_ubuntu_codename() {
  if [ -r /etc/os-release ]; then
    . /etc/os-release
    printf '%s' "${VERSION_CODENAME:-${UBUNTU_CODENAME:-focal}}"
  else
    printf 'focal'
  fi
}

install_nodejs() {
  if command -v node >/dev/null 2>&1; then
    green "Node.js already installed: $(node -v)"
    return
  fi

  green "Installing Node.js 18"
  curl -fsSL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh
  bash /tmp/nodesource_setup.sh
  apt-get install -y nodejs
}

install_mongodb() {
  if command -v mongod >/dev/null 2>&1; then
    green "MongoDB already installed"
    systemctl enable --now mongod || true
    return
  fi

  local codename
  local mongodb_major
  codename="$(detect_ubuntu_codename)"
  mongodb_major="4.4"

  if [ "$codename" = "jammy" ] || [ "$codename" = "noble" ]; then
    mongodb_major="8.0"
  fi

  green "Installing MongoDB ${mongodb_major} for Ubuntu ${codename}"
  apt-get update -y
  apt-get install -y gnupg curl
  install -d -m 0755 /usr/share/keyrings
  curl -fsSL "https://www.mongodb.org/static/pgp/server-${mongodb_major}.asc" | \
    gpg --dearmor -o "/usr/share/keyrings/mongodb-server-${mongodb_major}.gpg"

  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-${mongodb_major}.gpg ] https://repo.mongodb.org/apt/ubuntu ${codename}/mongodb-org/${mongodb_major} multiverse" \
    > "/etc/apt/sources.list.d/mongodb-org-${mongodb_major}.list"

  apt-get update -y
  apt-get install -y mongodb-org
  systemctl enable --now mongod
}

install_genieacs() {
  if command -v genieacs-cwmp >/dev/null 2>&1; then
    green "GenieACS binary already installed"
  else
    green "Installing GenieACS ${GENIEACS_VERSION}"
    npm install -g "genieacs@${GENIEACS_VERSION}"
  fi

  useradd --system --no-create-home --user-group genieacs 2>/dev/null || true
  mkdir -p /opt/genieacs/ext /var/log/genieacs
  chown -R genieacs:genieacs /opt/genieacs /var/log/genieacs

  local jwt_secret
  jwt_secret="$(openssl rand -hex 32 2>/dev/null || date +%s%N)"

  if [ ! -f /opt/genieacs/genieacs.env ]; then
    cat > /opt/genieacs/genieacs.env <<EOF
GENIEACS_CWMP_ACCESS_LOG_FILE=/var/log/genieacs/genieacs-cwmp-access.log
GENIEACS_NBI_ACCESS_LOG_FILE=/var/log/genieacs/genieacs-nbi-access.log
GENIEACS_FS_ACCESS_LOG_FILE=/var/log/genieacs/genieacs-fs-access.log
GENIEACS_UI_ACCESS_LOG_FILE=/var/log/genieacs/genieacs-ui-access.log
GENIEACS_DEBUG_FILE=/var/log/genieacs/genieacs-debug.yaml
GENIEACS_EXT_DIR=/opt/genieacs/ext
GENIEACS_UI_JWT_SECRET=${jwt_secret}
EOF
    chown genieacs:genieacs /opt/genieacs/genieacs.env
    chmod 600 /opt/genieacs/genieacs.env
  else
    green "Keeping existing /opt/genieacs/genieacs.env"
  fi

  create_service genieacs-cwmp "GenieACS CWMP" /usr/bin/genieacs-cwmp
  create_service genieacs-nbi  "GenieACS NBI"  /usr/bin/genieacs-nbi
  create_service genieacs-fs   "GenieACS FS"   /usr/bin/genieacs-fs
  create_service genieacs-ui   "GenieACS UI"   /usr/bin/genieacs-ui

  cat > /etc/logrotate.d/genieacs <<'EOF'
/var/log/genieacs/*.log /var/log/genieacs/*.yaml {
    daily
    rotate 30
    compress
    delaycompress
    dateext
}
EOF

  systemctl daemon-reload
  systemctl enable --now genieacs-cwmp genieacs-fs genieacs-ui genieacs-nbi
}

wait_for_nbi() {
  local url="${GENIEACS_NBI_URL:-http://127.0.0.1:7557}"
  local i

  green "Waiting for GenieACS NBI at ${url}"
  for i in $(seq 1 30); do
    if curl -fsS "${url}/devices/?limit=1" >/dev/null 2>&1; then
      return
    fi
    sleep 1
  done

  red "GenieACS NBI did not respond after 30 seconds"
  exit 1
}

create_service() {
  local name="$1"
  local description="$2"
  local exec_start="$3"

  cat > "/etc/systemd/system/${name}.service" <<EOF
[Unit]
Description=${description}
After=network.target mongod.service

[Service]
User=genieacs
EnvironmentFile=/opt/genieacs/genieacs.env
ExecStart=${exec_start}
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
}

main() {
  green "Starting Eglobal GenieACS install"
  apt-get update -y
  apt-get install -y curl ca-certificates gnupg openssl

  install_nodejs
  install_mongodb
  install_genieacs

  wait_for_nbi

  green "Installing Eglobal custom parameters"
  bash "${ROOT_DIR}/install-params.sh"

  local local_ip
  local_ip="$(hostname -I 2>/dev/null | awk '{print $1}')"
  green "Done. GenieACS UI: http://${local_ip:-server-ip}:3000"
}

main "$@"
