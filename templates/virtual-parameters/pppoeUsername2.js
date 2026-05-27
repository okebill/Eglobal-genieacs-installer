// ALIJAYA-NET pppUsername Optimized
const hourly = Date.now() - 3600000;
let result = '';

// 1. Jika ada input dari GUI (Write)
if (args[1] && args[1].value) {
    result = args[1].value[0];
    // Coba set ke semua jalur yang memungkinkan
    declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Username", null, {value: result});
    declare("Device.PPP.Interface.*.Username", null, {value: result});
} 
// 2. Jika proses pembacaan (Read)
else {
    // Ambil data dari TR-069 dan TR-181 sekaligus dengan cache 1 jam
    let ppp069 = declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Username", {value: hourly});
    let ppp181 = declare("Device.PPP.Interface.*.Username", {value: hourly});

    // Cari di TR-069 dulu
    for (let p of ppp069) {
        if (p.value && p.value[0] && p.value[0] !== "" && p.value[0] !== "acs") {
            result = p.value[0];
            break;
        }
    }

    // Jika di TR-069 tidak ketemu, cari di TR-181 (Mikrotik/ONT Baru)
    if (!result || result === '-') {
        for (let p of ppp181) {
            if (p.value && p.value[0]) {
                result = p.value[0];
                break;
            }
        }
    }
}

// Default jika benar-benar tidak ada data
if (!result) result = '-';

// log('pppUsername: ' + result);
return {writable: true, value: [result, "xsd:string"]};