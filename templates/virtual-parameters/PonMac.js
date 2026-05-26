// MAC Address adalah data tetap, gunakan cache 24 jam (86.400.000 ms)
const daily = Date.now() - 86400000;
let m = "";

// 1. Ambil Manufacturer dulu dengan cache
let manufacturerObj = declare("DeviceID.Manufacturer", {value: daily});
let brand = (manufacturerObj.value && manufacturerObj.value[0]) ? manufacturerObj.value[0] : "";

// 2. Logika berdasarkan Brand atau ketersediaan parameter
if (brand === "ZIONCOM") {
    // Zioncom biasanya menyimpan MAC yang relevan di WANPPPConnection
    let mac3 = declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.MACAddress", {value: daily});
    if (mac3.value && mac3.value[0]) m = mac3.value[0];
} 

// 3. Jika bukan Zioncom atau mac3 kosong, coba jalur Serial Number (khusus beberapa modem XPON)
if (!m) {
    let mac1 = declare("InternetGatewayDevice.DeviceInfo.X_CU_SerialNumber", {value: daily});
    if (mac1.value && mac1.value[0]) m = mac1.value[0];
}

// 4. Jika masih kosong, coba jalur LAN Host (Standar umum)
if (!m) {
    let mac2 = declare("InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MACAddress", {value: daily});
    if (mac2.value && mac2.value[0]) m = mac2.value[0];
}

return {writable: false, value: [m, "xsd:string"]};