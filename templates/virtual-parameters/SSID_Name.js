const daily = Date.now() - 86400000;
let ssidName = "-";

// Mengambil SSID pertama (indeks 1)
let ssid = declare("InternetGatewayDevice.BeaconDevice.1.WLANConfiguration.1.SSID", {value: daily});

if (ssid.size && ssid.value[0]) {
    ssidName = ssid.value[0];
}

return {writable: false, value: [ssidName, "xsd:string"]};