const { Web3 } = require("web3");

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://eth-sepolia.g.alchemy.com/v2/JzLs_sIi2ruO694q7uqsK"
  )
);

(async () => {

  const sub = await web3.eth.subscribe("newBlockHeaders");

  sub.on("data", (block) => {
    console.log("New block:", block.number);
  });

  sub.on("error", console.error);

  const subs = await web3.eth.subscribe("pendingTransactions")
    subs.on("data", txHash => {
    console.log("Pending tx:", txHash);
    });



})();
