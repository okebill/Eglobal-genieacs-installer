// IPTR069 Optimized - Anti Fault
const cacheTime = Date.now() - 300000; // Cache 5 menit
let result = '';

// 1. Ambil dari args (jika ada input manual dari GUI)
if (args[1] && args[1].value) {
    result = args[1].value[0];
}

// 2. Jika kosong, cari di TR-069 (InternetGatewayDevice)
if (!result || result === '0.0.0.0') {
    // Jalur paling umum untuk External IP
    let ppp = declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.ExternalIPAddress", {value: cacheTime});
    
    for (let item of ppp) {
        if (item.value && item.value[0] && item.value[0] !== '0.0.0.0') {
            result = item.value[0];
            break;
        }
    }
}

// 3. Jalur Alternatif untuk modem tipe tertentu (ZTE/Huawei khusus)
if (!result || result === '0.0.0.0') {
    let alt = declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.ExternalIPAddress", {value: cacheTime});
    if (alt.size && alt.value[0] && alt.value[0] !== '0.0.0.0') {
        result = alt.value[0];
    }
}

// 4. Fallback ke TR-181 (Device.IP) jika TR-069 gagal total
if (!result || result === '0.0.0.0') {
    let tr181 = declare("Device.IP.Interface.*.IPv4Address.*.IPAddress", {value: cacheTime});
    for (let addr of tr181) {
        if (addr.value && addr.value[0] && addr.value[0] !== '0.0.0.0') {
            result = addr.value[0];
            break;
        }
    }
}

// Pastikan hasil tidak null untuk menghindari error tampilan
result = (result && result !== '0.0.0.0') ? result : '-';

return {writable: false, value: [result, "xsd:string"]};