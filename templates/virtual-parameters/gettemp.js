// Gunakan cache 5 menit agar tidak membebani sensor hardware modem
const cacheTime = Date.now() - 300000;
let m = "N/A";

// Daftar path temperatur dari berbagai vendor
const tempPaths = [
    "InternetGatewayDevice.WANDevice.1.X_CU_WANEPONInterfaceConfig.OpticalTransceiver.Temperature",
    "InternetGatewayDevice.WANDevice.1.X_CU_WANGPONInterfaceConfig.OpticalTransceiver.Temperature",
    "InternetGatewayDevice.WANDevice.1.X_ZTE-COM_WANPONInterfaceConfig.TransceiverTemperature",
    "InternetGatewayDevice.WANDevice.1.X_CMCC_EponInterfaceConfig.TransceiverTemperature",
    "InternetGatewayDevice.WANDevice.1.X_CMCC_GponInterfaceConfig.TransceiverTemperature",
    "InternetGatewayDevice.WANDevice.1.X_GponInterafceConfig.TransceiverTemperature",
    "InternetGatewayDevice.WANDevice.1.X_CT-COM_EponInterfaceConfig.TransceiverTemperature",
    "InternetGatewayDevice.WANDevice.1.X_CT-COM_GponInterfaceConfig.TransceiverTemperature",
    "InternetGatewayDevice.WANDevice.1.X_FH_GponInterfaceConfig.TransceiverTemperature"
];

// Angka hasil perhitungan linearRegression dari data kamu:
// Slope & Intercept dipre-calculate agar CPU tidak bekerja dua kali
const SLOPE = 0.0035; 
const INTERCEPT = 4.35;

for (let path of tempPaths) {
    let res = declare(path, {value: cacheTime});
    if (res.size && res.value[0]) {
        let rawVal = res.value[0];
        
        // Jika nilai mentah sudah dalam Celsius (biasanya < 150)
        if (rawVal < 150) {
            m = rawVal.toString();
        } 
        // Jika nilai mentah dalam format TR-069 (ribuan), gunakan rumus regresi
        else {
            let tempCalc = (SLOPE * rawVal) + INTERCEPT;
            m = tempCalc.toFixed(0);
        }
        break; // Berhenti jika sudah ketemu satu nilai valid
    }
}

return {writable: false, value: [m, "xsd:string"]};