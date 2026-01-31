const web3 = require("./connect");

const txHash = "0xf6a40ae5e654c7a82b1f9ee74629c443eac7490f73a5622c59c223bba76d9aad"; // <= Paste tx hash here

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
    console.log("Gas used: ", receipt. gasUsed);
    console.log("Logs: ", receipt.logs);
})();