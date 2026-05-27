const hourly = Date.now() - 3600000;
let user = "";

// Jika admin mengubah username dari GUI (Write)
if (args[1] && args[1].value) {
    user = args[1].value[0];
    declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Username", null, {value: user});
} 
// Jika hanya menampilkan (Read)
else {
    // Ambil semua username yang ada di jalur WAN
    let ppp = declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Username", {value: hourly});
    
    for (let p of ppp) {
        // Cek: Apakah nilai ada, tidak kosong, dan bukan username ACS
        if (p.value && p.value[0] && p.value[0] !== "" && p.value[0] !== "acs") {
            user = p.value[0];
            break; 
        }
    }
}

return {writable: true, value: [user, "xsd:string"]};