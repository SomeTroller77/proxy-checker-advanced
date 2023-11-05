# proxy-checker-advanced

proxy-checker-advanced is an advanced proxy checker which stores the index of the last working proxy so 
you could get to the next proxy when you need to without going through the old non working proxies again!

## ATTENTION
This module only supports HTTP proxy checking for now, socks5 will be added soon
Theres no support for authentication. It will be added soon

## Usage

```bash
npm i proxy-checker-advanced
```

```js
const ProxyChecker = require('proxy-checker-advanced');
const proxycheck = new ProxyChecker(["proxy", "here"]);
(async ()=>{
    console.log(await proxycheck.checkAllProxies()); 
    /* checks all proxies and returns an array of json objects in following format
    {
        protocol:"",
        host:"",
        port:""
    }
    */
    console.log(await proxycheck.checkNextProxy(1));
    /*
        returns an arary of json objects containing the number of proxies requested by
        providing the number as parameter of function with the same format as checkAllProxies method
    */
})();

```