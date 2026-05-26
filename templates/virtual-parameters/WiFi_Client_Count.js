const hourly = Date.now() - 3600000;
let clients = 0;

// Mengambil jumlah host yang aktif di tabel jaringan lokal
let hosts = declare("InternetGatewayDevice.Landevice.1.Hosts.Host.*.Active", {value: hourly});

for (let host of hosts) {
    if (host.value && host.value[0] === true) {
        clients++;
    }
}

return {writable: false, value: [clients.toString(), "xsd:string"]};