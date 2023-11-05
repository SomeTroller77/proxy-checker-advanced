const ProxyChecker = require('./index.js');

const test = new ProxyChecker(["http://37.19.220.179:8443", "http://104.168.58.116:3128", "socks5://199.187.210.54:4145", "http://117.160.250.134:80"]);
(async () => {
    console.log(await test.checkNextProxy(1).catch((e) => console.log(e)));
    console.log(await test.checkNextProxy(1).catch((e) => console.log(e)));
})();