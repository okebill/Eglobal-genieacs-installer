// Password user statis, gunakan cache 24 jam (86.400.000 ms)
const daily = Date.now() - 86400000;
let m = "";

// Daftar jalur password user berdasarkan berbagai vendor (ZTE, HW, FH, dsb)
const userPwPaths = [
    "InternetGatewayDevice.X_CU_Function.Web.UserPassword",
    "InternetGatewayDevice.UserInterface.X_ZTE-COM_WebUserInfo.UserPassword",
    "InternetGatewayDevice.UserInterface.X_HW_WebUserInfo.1.Password",
    "InternetGatewayDevice.DeviceInfo.X_FH_Account.X_FH_WebUserInfo.WebPassword",
    "InternetGatewayDevice.User.2.Password",
    "InternetGatewayDevice.X_ZTE-COM_UserInterface.X_ZTE-COM_WebUserInfo.UserPassword"
];

// 1. Logika untuk MENGUBAH password (WRITE)
if (args[1] && args[1].value) {
    m = args[1].value[0];
    for (let path of userPwPaths) {
        // Cek dulu apakah path tersedia di modem sebelum menulis
        let check = declare(path, {value: daily});
        if (check.size) {
            declare(path, null, {value: m});
        }
    }
} 
// 2. Logika untuk MENAMPILKAN password (READ)
else {
    for (let path of userPwPaths) {
        let res = declare(path, {value: daily});
        if (res.size && res.value[0]) {
            m = res.value[0];
            break; // BERHENTI jika sudah ketemu satu nilai valid
        }
    }
}

return {writable: true, value: [m, "xsd:string"]};