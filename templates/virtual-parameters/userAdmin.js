// Username admin bersifat statis, gunakan cache 24 jam (86.400.000 ms)
const daily = Date.now() - 86400000;
let m = "";

// Daftar jalur username berdasarkan berbagai vendor
const userPaths = [
    "InternetGatewayDevice.X_CU_Function.Web.UserName",
    "InternetGatewayDevice.UserInterface.X_ZTE-COM_WebUserInfo.UserName",
    "InternetGatewayDevice.UserInterface.X_HW_WebUserInfo.1.UserName",
    "InternetGatewayDevice.DeviceInfo.X_FH_Account.X_FH_WebUserInfo.WebUsername",
    "InternetGatewayDevice.User.2.Username",
    "InternetGatewayDevice.X_ZTE-COM_UserInterface.X_ZTE-COM_WebUserInfo.UserName"
];

// 1. Logika untuk MENGUBAH username (WRITE)
if (args[1] && args[1].value) {
    m = args[1].value[0];
    for (let path of userPaths) {
        // Pastikan path ada di modem sebelum mencoba menulis
        let check = declare(path, {value: daily});
        if (check.size) {
            declare(path, null, {value: m});
        }
    }
} 
// 2. Logika untuk MENAMPILKAN username (READ)
else {
    for (let path of userPaths) {
        let res = declare(path, {value: daily});
        if (res.size && res.value[0]) {
            m = res.value[0];
            break; // LANGSUNG BERHENTI jika sudah ketemu satu nilai valid
        }
    }
}

return {writable: true, value: [m, "xsd:string"]};