// Gunakan cache 1-2 menit (60000 - 120000 ms)
const update = Date.now() - 60000;
let totalSecs = 0;

// 1. Ambil data Uptime PPPoE menggunakan wildcard yang efisien
// Kita ambil nilai pertama yang ditemukan yang memiliki nilai > 0
let ppp = declare("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.*.WANPPPConnection.*.Uptime", {value: update});

for (let p of ppp) {
    if (p.value && p.value[0] > 0) {
        totalSecs = p.value[0];
        break; // Berhenti jika sudah ketemu uptime dari koneksi yang aktif
    }
}

// 2. Jika di jalur WAN tidak ketemu, jangan paksa ambil dari Device Uptime 
// karena Device Uptime (waktu sejak modem nyala) berbeda dengan PPP Uptime (waktu sejak internet konek).

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