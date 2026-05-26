// Read/write WiFi password for common TR-098 WLAN paths.

var hourly = Date.now() - 3600000;
var m, r;
m = "";

if (args[1] && args[1].value) {
  m = args[1].value[0];
  declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.*.PreSharedKey.1.KeyPassphrase", null, {value: m});
  declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.*.KeyPassphrase", null, {value: m});
} else {
  for (r of declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.*.PreSharedKey.1.KeyPassphrase", {value: hourly})) {
    if (r.value && r.value[0]) { m = r.value[0]; break; }
  }
  if (!m) {
    for (r of declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.*.KeyPassphrase", {value: hourly})) {
      if (r.value && r.value[0]) { m = r.value[0]; break; }
    }
  }
}

return {writable: true, value: [m, "xsd:string"]};
