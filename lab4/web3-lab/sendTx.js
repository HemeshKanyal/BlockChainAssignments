const web3 = require("./connect");

const PRIVATE_KEY = "0x41d3ba410a6ca9b53504aceb915acaef68f3d36201d43c00f650cf72e31ac97d"; //<= Pate your Private Key Here
const RECEIVER = "0x01C1ca81a00E75321bBFb5abCC8184f40A06D3CD"; //<= Paste receiver address

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