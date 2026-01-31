const web3 = require("./connect");

const address = "0x4E17b3F760696b16a060fEF8A26cdf8F0521ac37"; // <= Paste Wallet Address

(async ()=>{
    const balance = await web3.eth.getBalance(address);
    const nonce = await web3.eth.getTransactionCount(address);
    console.log("Balance (ETH): ", web3.utils.fromWei(balance, "ether"));
    console.log("Transaction count (nonce):", nonce);
})();