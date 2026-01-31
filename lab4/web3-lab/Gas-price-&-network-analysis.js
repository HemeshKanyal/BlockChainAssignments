const web3 = require("./connect");

(async () => {

  const gasPrice = await web3.eth.getGasPrice();
  console.log("Current gas price (Wei):", gasPrice);
  console.log("Gas price (Gwei):",
    web3.utils.fromWei(gasPrice, "gwei")
  );

  const block = await web3.eth.getBlock("latest", true);

  console.log("\nRecent tx gas prices:");

  block.transactions.slice(0,5).forEach(tx => {
    console.log(tx.gasPrice);
  });

})();
