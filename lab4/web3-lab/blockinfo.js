const web3 = require("./connect");
(async () => {
    const address = "0x623B2a013d804253101A0b1679315c677427AFd1";
    const latestblock = await web3.eth.getBlock("latest", true);
    console.log("Block number: ", latestblock.number);
    console.log("TimeStamp: ", latestblock.timestamp);
    console.log("Miner / Validator: ", latestblock.miner);
    // console.log("No of transactions: ", latestblock.transactions.lenght);

    // const blockNumber = latestblock.number - 1n;
    // const block = await web3.eth.getBlock(blockNumber, true);
    // console.log("\nTransactions in block", blockNumber);
    // block.transactions.forEach(tx => console.log(tx));
    const count = await web3.eth.getTransactionCount(address, 'latest');
    console.log(`Transaction count for ${address}: ${count}`);
    console.log("Transaction hash: ", address.transactionHash);

})();