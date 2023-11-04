const ProxyChecker = require('./index.js');

const test = new ProxyChecker(["http://37.19.220.179:8443", "http://104.168.58.116:3128", "socks5://199.187.210.54:4145", "http://188.165.237.26:52982"]);
(async () => {
    console.log(await test.checkNextProxy(1).catch((e) => console.log(e)));
    console.log(await test.checkNextProxy(2).catch((e) => console.log(e)));
})();