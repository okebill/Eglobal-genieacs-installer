# Local MongoDB Dumps

This folder is for local GenieACS config dumps created by:

```bash
sudo bash export-current-config.sh
```

Expected private files:

```text
config.bson
provisions.bson
virtualParameters.bson
presets.bson
permissions.bson
```

These files are ignored by Git because they may contain sensitive config and credentials.

Do not commit:

```text
devices.bson
tasks.bson
faults.bson
cache.bson
locks.bson
users.bson
```

For public use, this repository installs the important Eglobal/EkoNet customizations from the scripts in `templates/`.
