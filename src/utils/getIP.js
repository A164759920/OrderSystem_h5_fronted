// const os = require("os");

// /**
//  * @return {Array} // 返回无线局域网适配器IP地址
//  */
// const getIPAddress = function () {
//   var ifaces = os.networkInterfaces();
//   var ip = [];
//   for (var dev in ifaces) {
//     ifaces[dev].forEach((details) => {
//       if (
//         details.family === "IPv4" &&
//         !details.internal &&
//         details.netmask === "255.255.255.0" &&
//         details.address.split(".")[3] !== "1" // 过滤以太网适配器IP地址
//       ) {
//         ip.push(details.address);
//       }
//     });
//   }
//   console.log(ip);
//   return ip || false;
// };
// module.exports = {
//   getIPAddress,
// };
