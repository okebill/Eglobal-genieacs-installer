const hourly = Date.now() - 3600000;
let status = [];

// Cek status LAN 1 sampai 4
let ports = declare("InternetGatewayDevice.Landevice.1.LANEthernetInterfaceConfig.*.Status", {value: hourly});

let i = 1;
for (let p of ports) {
    let s = (p.value && p.value[0] === "Up") ? "L" + i + ":OK" : "L" + i + ":--";
    status.push(s);
    i++;
}

return {writable: false, value: [status.join(" | "), "xsd:string"]};