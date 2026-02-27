//import { Web3 } from 'web3';
// const { Web3 } = require('web3');
//private RPC endpoint
// const web3 = new
// Web3('https://eth-sepolia.g.alchemy.com/v2/JzLs_sIi2ruO694q7uqsK');
//or public RPC endpoint
//const web3 = new
// Web3('https://eth.llamarpc.com');
// web3.eth.getBlockNumber().then(console.log);

import Web3 from "web3";

let web3;
let accounts;

window.addEventListener("load", async () => {

  if (window.ethereum) {
    web3 = new Web3(window.ethereum);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" }); // await window.etherium.enable(); will not work because MetaMask officially replaced it with code 
    } catch (error) {
      console.error("User denied access", error);
    }
    accounts = await web3.eth.getAccounts();
    alert("Signed in with: " + accounts[0]);

  } else {
    alert("MetaMask not installed!");
  }

});


const valueInput = document.getElementById('value');
const recipientInput = document.getElementById('recipient');
const sendTransactionBtn = document.getElementById('sendTransactionBtn');
sendTransactionBtn.addEventListener("click", async () => {
  const valueInEth = valueInput.value;
  const weiValue = web3.utils.toWei(valueInEth, "ether");
  const recipient = recipientInput.value;
  web3.eth.sendTransaction({
    from: accounts[0],
    to: recipient,
    value: weiValue
  })
    .on('transactionHash', function (hash) {
      alert("Transaction Hash: " + hash);
    })
    .on('receipt', function (receipt) {
      console.log(receipt);
    })
    .on('error', console.error);
})