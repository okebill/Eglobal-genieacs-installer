// Jalankan setiap inform - fetch Host table + hitung ulang activedevices
declare("InternetGatewayDevice.LANDevice.1.Hosts.Host.*.HostName", {path: 1, value: 1});
declare("InternetGatewayDevice.LANDevice.1.Hosts.Host.*.IPAddress", {path: 1, value: 1});
declare("InternetGatewayDevice.LANDevice.1.Hosts.Host.*.MACAddress", {path: 1, value: 1});
declare("InternetGatewayDevice.LANDevice.1.Hosts.Host.*.Active", {path: 1, value: 1});
declare("VirtualParameters.activedevices", {value: 1});
