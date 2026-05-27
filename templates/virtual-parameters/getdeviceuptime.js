// Gunakan cache 1 menit (60000 ms) agar tidak terlalu sering nembak modem
const update = Date.now() - 60000;
let totalSecs = 0;

// 1. Ambil Brand dengan cache
const brandObj = declare('DeviceID.Manufacturer', {value: update});
const brand = (brandObj.value && brandObj.value[0]) ? brandObj.value[0] : "";

// 2. Ambil Nilai Uptime (Hanya READ, tidak perlu logika WRITE/SET)
if (brand !== 'MikroTik') {
    let res = declare("InternetGatewayDevice.DeviceInfo.UpTime", {value: update});
    totalSecs = (res.value && res.value[0]) ? res.value[0] : 0;
} else {
    let res = declare("Device.DeviceInfo.UpTime", {value: update});
    totalSecs = (res.value && res.value[0]) ? res.value[0] : 0;
}

// 3. Konversi ke Format d hh:mm:ss
let days = Math.floor(totalSecs / 86400);
let rem  = totalSecs % 86400;
let hrs  = Math.floor(rem / 3600);
hrs = (hrs < 10) ? "0" + hrs : hrs;

rem  = rem % 3600;
let mins = Math.floor(rem / 60);
mins = (mins < 10) ? "0" + mins : mins;

let secs = rem % 60;
secs = (secs < 10) ? "0" + secs : secs;

let up = days + "d " + hrs + ":" + mins + ":" + secs;

return {writable: false, value: [up, "xsd:string"]};