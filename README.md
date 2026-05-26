# Eglobal GenieACS Installer

Custom GenieACS installer and parameter overlay for Eglobal/EkoNet ACS.

This repository is designed to be safe for a public GitHub repository:

- It does **not** include customer device data.
- It does **not** include Telegram bot tokens.
- It does **not** include ACS passwords in committed files.
- It can export your current GenieACS config locally, but exported `.bson` files are ignored by Git by default.

## What This Installs

- GenieACS `cwmp`, `nbi`, `fs`, and `ui` services.
- MongoDB and Node.js dependencies.
- Custom virtual parameters:
  - `activedevices`
  - `WlanPassword`
- Custom `inform` provision template.
- Device list UI config overlay for:
  - active LAN host count
  - WiFi password column
  - safe summon refresh parameters

## Quick Install On New Server

```bash
git clone https://github.com/okebill/Eglobal-genieacs-installer.git
cd Eglobal-genieacs-installer
sudo bash install.sh
```

## Install / Update Parameters Only

Use this when GenieACS is already installed:

```bash
cd Eglobal-genieacs-installer
sudo ACS_PASS='your-acs-password' CONN_REQ_PASS='your-connreq-password' bash install-params.sh
```

Optional environment variables:

```bash
GENIEACS_NBI_URL=http://127.0.0.1:7557
ACS_USER=acs
ACS_PASS=your-password
CONN_REQ_USER=acs
CONN_REQ_PASS=your-password
INFORM_INTERVAL=200
```

If `ACS_PASS` or `CONN_REQ_PASS` is not provided, the script will ask for it interactively.

## Backup Current ACS

Full backup:

```bash
sudo bash backup-current.sh
```

Export only reusable config collections:

```bash
sudo bash export-current-config.sh
```

The export script writes these local dump files:

```text
db/config.bson
db/provisions.bson
db/virtualParameters.bson
db/presets.bson
db/permissions.bson
```

These files are ignored by Git because they may contain sensitive data. Keep them private.

## Important Safety Notes

Do not restore customer data into a new ACS unless you really intend to migrate devices. This project intentionally avoids restoring:

```text
devices
tasks
faults
cache
locks
```

The dangerous command below is intentionally **not** used here:

```bash
mongorestore --db genieacs --drop db
```

That command can overwrite your whole ACS database, including customer devices.
