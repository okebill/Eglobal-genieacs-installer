# Eglobal GenieACS Installer

Installer GenieACS custom dan parameter overlay untuk ACS Eglobal/EkoNet.

Repository ini dibuat agar aman dipublikasikan di GitHub:

- Tidak berisi data perangkat pelanggan.
- Tidak berisi token bot Telegram.
- Tidak berisi password ACS di file yang di-commit.
- Bisa export config GenieACS lokal, tetapi file `.bson` hasil export otomatis diabaikan oleh Git.

## Yang Diinstal

- Service GenieACS `cwmp`, `nbi`, `fs`, dan `ui`.
- Dependency MongoDB dan Node.js.
- Virtual Parameter custom:
  - `activedevices`
  - `WlanPassword`
  - semua Virtual Parameter hasil export dari ACS live di `templates/virtual-parameters/*.js`
- Template provision `inform` custom.
- Provision tambahan:
  - `bootstrap`
  - `default`
  - `refresh-activedevices`
  - `useradmin` versi aman tanpa password asli
- Overlay config UI device list untuk:
  - jumlah LAN host aktif
  - kolom password WiFi
  - parameter summon yang aman

## Virtual Parameter Yang Disertakan

Repo ini berisi Virtual Parameter berikut, hasil export dari ACS live:

```text
IPTR069
PonMac
RXPower
activedevices
getSerialNumber
getdeviceuptime
getponmode
getpppuptime
gettemp
pppoeIP
pppoeMac
pppoePassword
pppoeUsername
pppoeUsername2
superAdmin
superPassword
userAdmin
userPassword
WiFi_Client_Count
LAN_Port_Status
SSID_Name
VLAN_ID
WlanPassword
```

## Install Cepat Di Server Baru

```bash
git clone https://github.com/okebill/Eglobal-genieacs-installer.git
cd Eglobal-genieacs-installer
sudo bash install.sh
```

## Install / Update Parameter Saja

Gunakan ini jika GenieACS sudah terinstall dan Anda hanya ingin memasang/update parameter custom:

```bash
cd Eglobal-genieacs-installer
sudo ACS_PASS='your-acs-password' CONN_REQ_PASS='your-connreq-password' bash install-params.sh
```

Environment variable opsional:

```bash
GENIEACS_NBI_URL=http://127.0.0.1:7557
ACS_USER=acs
ACS_PASS=your-password
CONN_REQ_USER=acs
CONN_REQ_PASS=your-password
INFORM_INTERVAL=200
```

Jika `ACS_PASS` atau `CONN_REQ_PASS` tidak diisi, script akan memintanya secara interaktif.

## Backup ACS Saat Ini

Backup penuh:

```bash
sudo bash backup-current.sh
```

Export hanya collection config yang bisa dipakai ulang:

```bash
sudo bash export-current-config.sh
```

Script export akan membuat file dump lokal berikut:

```text
db/config.bson
db/provisions.bson
db/virtualParameters.bson
db/presets.bson
db/permissions.bson
```

File tersebut diabaikan oleh Git karena bisa berisi data sensitif. Simpan secara private.

## Catatan Keamanan Penting

Jangan restore data pelanggan ke ACS baru kecuali Anda memang ingin migrasi perangkat. Project ini sengaja tidak restore collection berikut:

```text
devices
tasks
faults
cache
locks
```

Command berbahaya di bawah ini sengaja **tidak** digunakan:

```bash
mongorestore --db genieacs --drop db
```

Command tersebut bisa menimpa seluruh database ACS, termasuk data perangkat pelanggan.
