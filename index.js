const axios = require('axios');
const {SocksProxyAgent} = require("socks-proxy-agent");
const socks = require('socksv5');

module.exports = class ProxyChecker{
    #proxies;
    #workingProxies;
    #actip;
    #index;
    constructor(pproxies){
        this.#proxies=[];
        this.#actip = "";
        this.#workingProxies =[];
        this.#index = 0;
        pproxies.forEach((proxy) => {
            proxy = proxy.split(":");
            proxy[1] = proxy[1].split("/")[2]
            console.log(proxy);
            this.#proxies.push({protocol:proxy[0], host:proxy[1], port:proxy[2]});
        });
    }
    async checkAllProxies(){
        return new Promise(async (resolve, reject) =>{
            this.#actip = (await axios.get("https://api.ipify.org/?format=json")).data.ip;
            for(this.#index=0; this.#index < this.#proxies.length; this.#index++){
                try{
                    if(this.#proxies[this.#index].protocol === "socks5"){
                        var res = await axios.get("https://api.ipify.org/?format=json",
                        {
                            timeout:5000,
                            proxy:{
                                    protocol:this.#proxies[this.#index].protocol,
                                    host:this.#proxies[this.#index].host,
                                    port:this.#proxies[this.#index].port,
                                    agent:new socks.httpAgent({proxyHost:this.#proxies[this.#index].host, proxyPort:this.#proxies[this.#index].port})
                                }
                        });
                    }else if(this.#proxies[this.#index].protocol === "http" || this.#proxies[this.#index].protocol === "https"){
                        var res = await axios.get("https://api.ipify.org/?format=json",
                        {
                            timeout:5000,
                            proxy:{
                                    protocol:this.#proxies[this.#index].protocol,
                                    host:this.#proxies[this.#index].host,
                                    port:this.#proxies[this.#index].port,
                                }
                        });
                    }
                    
                    if(res.data.ip == this.#actip) throw new Error("Proxy is not working");
                    this.#workingProxies.push({protocol: this.#proxies[this.#index].protocol,host:this.#proxies[this.#index].host, port:this.#proxies[this.#index].port});
                }catch(e){
                    console.log(e.message);
                }
            }
            resolve(this.#workingProxies);
        });
    }
    async checkNextProxy(i){
        var workingProxies = [];
        if(i > this.#proxies.length) throw new Error("Number of working proxies requested is greater tha number of proxies given to check")
        if(this.#index == this.#proxies.length) throw new Error("All proxies have been checked");
        return new Promise(async (resolve, reject) =>{
            while(workingProxies.length !=  i && this.#index < this.#proxies.length){
                try{
                    if(this.#proxies[this.#index].protocol === "socks5"){
                        const proxy = new SocksProxyAgent(`socks5://${this.#proxies[this.#index].host}:${this.#proxies[this.#index].port}`)
                        var res = await axios.get("https://api.ipify.org/?format=json",
                        {
                            httpAgent:proxy,
                            httpsAgent:proxy,
                            timeout:5000,
                            proxy:{
                                    protocol:this.#proxies[this.#index].protocol,
                                    host:this.#proxies[this.#index].host,
                                    port:this.#proxies[this.#index].port
                                }
                        });
                    }else if(this.#proxies[this.#index].protocol === "http" || this.#proxies[this.#index].protocol === "https"){
                        var res = await axios.get("https://api.ipify.org/?format=json",
                        {
                            timeout:5000,
                            proxy:{
                                    protocol:this.#proxies[this.#index].protocol,
                                    host:this.#proxies[this.#index].host,
                                    port:this.#proxies[this.#index].port,
                                }
                        });
                    }
                    if(res) workingProxies.push({protocol: this.#proxies[this.#index].protocol,host:this.#proxies[this.#index].host, port:this.#proxies[this.#index].port});
                }catch(e){
                    console.log(e.message);
                }
                this.#index++;
            }
            if(workingProxies.length == 0){
                resolve(null);
            }else{
                resolve(workingProxies);
            }
        });
    }
}
