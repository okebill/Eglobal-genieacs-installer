// Gunakan cache 5-10 menit (300000 - 600000 ms) agar tidak menyiksa modem
const cacheTime = Date.now() - 300000;
let m = "N/A";

// Fungsi pembantu untuk konversi nilai integer ZTE ke dBm
function convertZte(val) {
    if (val < 0) return val;
    if (val > 0) {
        let db = 30 + (Math.log10((val * (Math.pow(10, -7)))) * 10);
        return Math.ceil(db * 100) / 100;
    }
    return "N/A";
}

// 1. Coba vendor yang mengirim nilai mentah (ZTE & Rebrandingnya)
const ztePaths = [
    "InternetGatewayDevice.WANDevice.*.X_ZTE-COM_WANPONInterfaceConfig.RXPower",
    "InternetGatewayDevice.WANDevice.*.X_CMCC_EponInterfaceConfig.RXPower",
    "InternetGatewayDevice.WANDevice.*.X_CMCC_GponInterfaceConfig.RXPower",
    "InternetGatewayDevice.WANDevice.*.X_CT-COM_EponInterfaceConfig.RXPower",
    "InternetGatewayDevice.WANDevice.*.X_CT-COM_GponInterfaceConfig.RXPower",
    "InternetGatewayDevice.WANDevice.*.X_CU_WANEPONInterfaceConfig.OpticalTransceiver.RXPower"
];

for (let path of ztePaths) {
    let res = declare(path, {value: cacheTime});
    if (res.size && res.value[0]) {
        return {writable: false, value: [convertZte(res.value[0]).toString(), "xsd:string"]};
    }
}

// 2. Coba vendor yang mengirim nilai sudah jadi (Huawei, FH, Nokia)
const directPaths = [
    "InternetGatewayDevice.WANDevice.*.X_GponInterafceConfig.RXPower",
    "InternetGatewayDevice.WANDevice.*.X_FH_GponInterfaceConfig.RXPower",
    "InternetGatewayDevice.X_ALU_OntOpticalParam.RXPower"
];

for (let path of directPaths) {
    let res = declare(path, {value: cacheTime});
    if (res.size && res.value[0]) {
        return {writable: false, value: [res.value[0].toString(), "xsd:string"]};
    }
}

return {writable: false, value: [m, "xsd:string"]};