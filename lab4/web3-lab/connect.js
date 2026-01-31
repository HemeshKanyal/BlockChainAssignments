const {Web3} = require("web3");

const web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/JzLs_sIi2ruO694q7uqsK");

(async ()=>{
    const block = await web3.eth.getBlockNumber();
    console.log("Current block number : ", block);
})();

module.exports = web3;