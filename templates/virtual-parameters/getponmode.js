// Informasi hardware sangat statis, gunakan cache 24 jam
const daily = Date.now() - 86400000;
let pon = "Ethernet";

// 1. Ambil Brand terlebih dahulu (paling ringan)
const brandObj = declare('DeviceID.Manufacturer', {value: daily});
const brand = (brandObj.value && brandObj.value[0]) ? brandObj.value[0].toUpperCase() : "";

// 2. Jika Brand adalah Raisecom, langsung tentukan GPON (Efisiensi tinggi)
if (brand === 'RAISECOM') {
    pon = "GPON";
} 
else {
    // 3. Jika bukan, baru ambil data dari modem
    let v1 = declare("InternetGatewayDevice.WANDevice.*.WANCommonInterfaceConfig.WANAccessType", {value: daily});
    
    if (v1.size && v1.value[0]) {
        let accessType = v1.value[0].toUpperCase();
        
        if (accessType.includes("GPON")) {
            pon = "GPON";
        } else if (accessType.includes("EPON")) {
            pon = "EPON";
        } else if (accessType.includes("PON")) {
            pon = "GPON"; // Default jika hanya tertulis "PON"
        }
    }
}

return {writable: false, value: [pon, "xsd:string"]};