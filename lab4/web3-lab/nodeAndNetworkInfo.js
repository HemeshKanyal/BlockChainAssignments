const web3 = require("./connect");
(async ()=>{
    console.log("Client: ", await web3.eth.getNodeInfo());
    console.log("Network ID: ", await web3.eth.net.getId());
    console.log("Chain ID: ", await web3.eth.getChainId());
    console.log("Current block: ", await web3.eth.getBlockNumber());
})();