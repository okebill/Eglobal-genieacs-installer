// MAC Address adalah data statis, gunakan cache 24 jam (86.400.000 ms)
const daily = Date.now() - 86400000;
let m = "";

// Ambil SEMUA MAC Address dari semua profil WAN PPP yang ada secara otomatis
// Penggunaan wildcard '*' menggantikan w1, w2, w3, w4 dalam satu baris
let ppp = declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.*.WANPPPConnection.*.MACAddress", {value: daily});

for (let p of ppp) {
    if (p.value && p.value[0] && p.value[0] !== "" && p.value[0] !== "00:00:00:00:00:00") {
        m = p.value[0];
        break; // Berhenti jika sudah menemukan MAC Address pertama yang valid
    }
}

return {writable: false, value: [m, "xsd:string"]};