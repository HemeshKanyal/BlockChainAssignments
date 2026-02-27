const web3 = require("./connect");

const txHash = "0x7b2a992c3acf072b4de58b3642352b15361c569fd8d38f85e87a0a5c5dac3035"; // <= Paste tx hash here

(async () => {
    const tx = await web3.eth.getTransaction(txHash);
    console.log("From: ", tx.from);
    console.log("To: ", tx.to);
    console.log("Value (ETH): ", web3.utils.fromWei(tx.value, "ether"));
    console.log("Gas: ", tx.gas);
    console.log("Gas Price: ", tx.gasPrice);
    console.log("Nonce: ", tx.nonce);
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    console.log("\nStatus: ", receipt.status);
    console.log("Gas used: ", receipt.gasUsed);
    console.log("Logs: ", receipt.logs);
})();