// Eglobal/EkoNet inform provision.
// Placeholders are replaced by install-params.sh before upload.

const NOW = Date.now();
const daily  = NOW - 86400000;
const hourly = NOW - 3600000;
const update = NOW - 60000;

const informInterval = __INFORM_INTERVAL__;
const AcsUser     = "__ACS_USER__";
const AcsPass     = "__ACS_PASS__";
const ConnReqUser = "__CONN_REQ_USER__";
const ConnReqPass = "__CONN_REQ_PASS__";

const brandObj = declare("DeviceID.Manufacturer", {value: daily});
if (!brandObj.value) return;
const brand = brandObj.value[0];

if (brand !== "MikroTik") {
  declare("InternetGatewayDevice.ManagementServer.Username",                  {value: daily},  {value: AcsUser});
  declare("InternetGatewayDevice.ManagementServer.Password",                  {value: daily},  {value: AcsPass});
  declare("InternetGatewayDevice.ManagementServer.ConnectionRequestUsername", {value: update}, {value: ConnReqUser});
  declare("InternetGatewayDevice.ManagementServer.ConnectionRequestPassword", {value: update}, {value: ConnReqPass});
  declare("InternetGatewayDevice.ManagementServer.PeriodicInformEnable",      {value: daily},  {value: true});
  declare("InternetGatewayDevice.ManagementServer.PeriodicInformInterval",    {value: daily},  {value: informInterval});

  declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*", {path: hourly});
  declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANIPConnection.*",  {path: hourly});

  declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Enable",            {value: hourly});
  declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.ConnectionType",    {value: hourly});
  declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.ExternalIPAddress", {value: hourly});
  declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.Username",          {value: hourly});
  declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANPPPConnection.*.NATEnabled",        {value: hourly});
  declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANIPConnection.*.Enable",             {value: hourly});
  declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANIPConnection.*.ConnectionType",     {value: hourly});
  declare("InternetGatewayDevice.WANDevice.*.WANConnectionDevice.*.WANIPConnection.*.ExternalIPAddress",  {value: hourly});

  declare("InternetGatewayDevice.LANDevice.*.WLANConfiguration.*",                   {path: hourly});
  declare("InternetGatewayDevice.LANDevice.*.WLANConfiguration.*.SSID",              {value: hourly});
  declare("InternetGatewayDevice.LANDevice.*.WLANConfiguration.*.Enable",            {value: hourly});
  declare("InternetGatewayDevice.LANDevice.*.WLANConfiguration.*.TotalAssociations", {value: hourly});

  declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.*.PreSharedKey.1.KeyPassphrase", {value: hourly});
  declare("InternetGatewayDevice.LANDevice.1.WLANConfiguration.*.KeyPassphrase",                {value: hourly});
  declare("VirtualParameters.WlanPassword", {value: hourly});

  declare("InternetGatewayDevice.LANDevice.1.Hosts.Host.*.HostName",   {path: hourly, value: hourly});
  declare("InternetGatewayDevice.LANDevice.1.Hosts.Host.*.IPAddress",  {path: hourly, value: hourly});
  declare("InternetGatewayDevice.LANDevice.1.Hosts.Host.*.MACAddress", {path: hourly, value: hourly});

  declare("VirtualParameters.activedevices", {value: hourly});
} else {
  declare("Device.ManagementServer.Username",                  {value: daily}, {value: AcsUser});
  declare("Device.ManagementServer.Password",                  {value: daily}, {value: AcsPass});
  declare("Device.ManagementServer.ConnectionRequestUsername", {value: daily}, {value: ConnReqUser});
  declare("Device.ManagementServer.ConnectionRequestPassword", {value: daily}, {value: ConnReqPass});
  declare("Device.ManagementServer.PeriodicInformEnable",      {value: daily}, {value: true});
  declare("Device.ManagementServer.PeriodicInformInterval",    {value: daily}, {value: informInterval});
}
