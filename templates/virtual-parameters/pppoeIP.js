// pppoeIP Optimized - Anti Fault
const cacheTime = Date.now() - 120000; // Cache 2 menit
let result = '';

// 1. Ambil nilai dari args (jika ada input dari dashboard)
if (args[1] && args[1].value) {
    result = args[1].value[0];
}

// 2. Jika kosong, cari di jalur InternetGatewayDevice (TR-069)
if (!result || result === '0.0.0.0') {
    // Cari semua instance PPP Connection
    let ppp = declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.ExternalIPAddress", {value: cacheTime});
    
    for (let item of ppp) {
        if (item.value && item.value[0] && item.value[0] !== '0.0.0.0') {
            result = item.value[0];
            break; 
        }
    }
}

// 3. Jika masih kosong, cari di jalur Device.IP (TR-181) - Biasa untuk Mikrotik/ONT Baru
if (!result || result === '0.0.0.0') {
    let tr181 = declare("Device.IP.Interface.*.IPv4Address.*.IPAddress", {value: cacheTime});
    for (let addr of tr181) {
        if (addr.value && addr.value[0] && addr.value[0] !== '0.0.0.0') {
            result = addr.value[0];
            break;
        }
    }
}

// 4. Pastikan hasil akhir string, jika gagal total berikan '-'
result = (result && result !== '0.0.0.0') ? result : '-';

return {writable: false, value: [result, "xsd:string"]};