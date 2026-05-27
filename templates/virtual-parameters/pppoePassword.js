// Gunakan cache 1 jam (3600000 ms) agar tidak membebani koneksi CWMP
const hourly = Date.now() - 3600000;
let pw = "";

// 1. Jika Admin mengubah password melalui ACS (WRITE)
if (args[1] && args[1].value) {
    pw = args[1].value[0];
    // Set password ke semua instance PPP yang ada
    declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Password", null, {value: pw});
} 
// 2. Jika hanya menampilkan password di dashboard (READ)
else {
    // Ambil password dari database ACS atau modem dengan cache
    let v1 = declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Password", {value: hourly});

    if (v1.size && v1.value[0]) {
        pw = v1.value[0];
    }
}

return {writable: true, value: [pw, "xsd:string"]};