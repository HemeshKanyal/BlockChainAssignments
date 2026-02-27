const web3 = require("./connect");

const address = "0x623B2a013d804253101A0b1679315c677427AFd1"; // <= Paste Wallet Address

(async () => {
    const balance = await web3.eth.getBalance(address);
    const nonce = await web3.eth.getTransactionCount(address);
    console.log("Balance (ETH): ", web3.utils.fromWei(balance, "ether"));
    console.log("Transaction count (nonce):", nonce);
})();