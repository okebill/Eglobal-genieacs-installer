const daily = Date.now() - 86400000;
let vlan = "-";

// Mencari VLAN di profil WAN
let wanVlan = declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.*.WANPPPConnection.*.X_ZTE-COM_VLANID", {value: daily});

if (!wanVlan.size) {
    // Jalur alternatif untuk beberapa vendor lain
    wanVlan = declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.*.WANPPPConnection.*.MarkVLAN", {value: daily});
}

for (let v of wanVlan) {
    if (v.value && v.value[0]) {
        vlan = v.value[0];
        break;
    }
}

return {writable: false, value: [vlan.toString(), "xsd:string"]};