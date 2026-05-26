// Total active LAN hosts = unique MAC count from Hosts.Host table.
// Use for-of declare() iteration in GenieACS.

var hourly = Date.now() - 3600000;
var seen = {};
var active = 0;
var key, row, path, paths, i;

function addMac(m) {
  if (!m) return;
  key = String(m).trim().toUpperCase().replace(/-/g, ":");
  if (key.length >= 11 && key !== "00:00:00:00:00:00" && !seen[key]) {
    seen[key] = 1;
    active++;
  }
}

paths = [
  "InternetGatewayDevice.LANDevice.1.Hosts.Host.*.MACAddress",
  "InternetGatewayDevice.LANDevice.*.Hosts.Host.*.MACAddress",
  "Device.Hosts.Host.*.MACAddress",
  "Device.Hosts.Host.*.PhysAddress"
];

for (i = 0; i < paths.length; i++) {
  path = paths[i];
  for (row of declare(path, {path: hourly, value: hourly})) {
    addMac(row.value[0]);
  }
  if (active > 0) break;
}

return {writable: false, value: [active, "xsd:int"]};
