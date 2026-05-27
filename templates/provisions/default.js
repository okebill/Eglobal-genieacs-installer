const NOW = Date.now();
const daily = NOW - 86400000;
const hourly = NOW - 3600000;
const update = NOW - 60000;

// Ambil data dasar dulu
const merk = declare('DeviceID.Manufacturer', {value: daily}).value[0];
const model = declare('DeviceID.ProductClass', {value: daily}).value[0] || "";

// HENTIKAN skrip jika brand adalah MikroTik atau model tertentu untuk hemat CPU
if (["MikroTik", "CIOT", "ZICG"].includes(merk) || model.includes("M63X")) return;

// Ambil Uptime untuk logika remot
const uptime = declare('InternetGatewayDevice.DeviceInfo.UpTime', {value: update}).value[0];

// --- SEKSI REMOTE MANAGEMENT (Gunakan IF-ELSE agar tidak bentrok) ---
if (merk === "FiberHome") {
    // Logika Fiberhome saja
    const enableRemot = uptime > 220;
    declare("InternetGatewayDevice.X_FH_FireWall.REMOTEACCEnable", {value: daily}, {value: enableRemot});
    declare("InternetGatewayDevice.X_FH_Remoteweblogin.webloginenable", {value: daily}, {value: enableRemot ? "1" : "0"});
}
else if (merk === "Huawei") {
    declare("InternetGatewayDevice.X_HW_Security.AclServices.HTTPWanEnable", {value: daily}, {value: true});
}
else if (merk === "ZTE") {
    // Logika ZTE saja
}

// --- SEKSI UPDATE PARAMETER (Hanya yang penting) ---
// Kelompokkan declare agar tidak terpanggil setiap detik
if (NOW % 5 === 0) { // Hanya jalan di 20% total inform (Opsional: teknik throttling)
    declare("VirtualParameters.RXPower", {path: update, value: update});
    declare("VirtualParameters.pppoeIP", {path: update, value: update});
}

// --- SEKSI WAN & WLAN (Sangat Berat, gunakan cache lebih lama) ---
// Gunakan 'hourly' daripada 'update' untuk list tetangga/associated devices
declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.*.AssociatedDevice.*.AssociatedDeviceIPAddress", {path: hourly, value: hourly});

// Untuk vendor-specific, panggil HANYA jika brand cocok
if (merk === "Huawei") {
    declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.X_HW_VLAN", {path: hourly, value: hourly});
    // ... parameter huawei lainnya
}
