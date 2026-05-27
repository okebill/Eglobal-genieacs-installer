// Password superadmin sangat jarang berubah, gunakan cache 24 jam (86.400.000 ms)
const daily = Date.now() - 86400000;
let m = "";

// Daftar jalur password berdasarkan vendor (ZTE, Huawei, Fiberhome, CU, CT, CMCC)
const adminPaths = [
    "InternetGatewayDevice.X_CU_Function.Web.AdminPassword",
    "InternetGatewayDevice.X_Authentication.WebAccount.Password",
    "InternetGatewayDevice.UserInterface.X_HW_WebUserInfo.2.Password",
    "InternetGatewayDevice.DeviceInfo.X_CT-COM_TeleComAccount.Password",
    "InternetGatewayDevice.DeviceInfo.X_CMCC_TeleComAccount.Password",
    "InternetGatewayDevice.DeviceInfo.X_FH_Account.X_FH_WebUserInfo.WebSuperPassword",
    "InternetGatewayDevice.User.1.Password",
    "InternetGatewayDevice.UserInterface.X_ZTE-COM_WebUserInfo.AdminPassword",
    "InternetGatewayDevice.X_ZTE-COM_UserInterface.X_ZTE-COM_WebUserInfo.AdminPassword"
];

// 1. Logika untuk MENGUBAH password (WRITE)
if (args[1] && args[1].value) {
    m = args[1].value[0];
    for (let path of adminPaths) {
        // Cek dulu apakah path tersebut ada di modem sebelum mencoba menulis
        let check = declare(path, {value: daily});
        if (check.size) {
            declare(path, null, {value: m});
        }
    }
} 
// 2. Logika untuk MENAMPILKAN password (READ)
else {
    for (let path of adminPaths) {
        let res = declare(path, {value: daily});
        if (res.size && res.value[0]) {
            m = res.value[0];
            break; // LANGSUNG BERHENTI jika sudah ketemu satu nilai valid
        }
    }
}

return {writable: true, value: [m, "xsd:string"]};