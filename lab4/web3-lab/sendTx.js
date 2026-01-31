const web3 = require("./connect");

const PRIVATE_KEY = "// put here private key"; //<= Pate your Private Key Here
const RECEIVER = "0x7DCf6a8830df949486fc7980Bbff4603AF582204"; //<= Paste receiver address

(async () => {
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);
    const tx = {
        from: account.address,
        to: RECEIVER,
        value: web3.utils.toWei("0.01", "ether"),
        gas: 21000
    };
    const receipt = await web3.eth.sendTransaction(tx);
    console.log("Transaction hash: ", receipt.transactionHash);
    console.log("Receipt: ", receipt);
})();