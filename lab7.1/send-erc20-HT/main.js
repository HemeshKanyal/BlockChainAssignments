// Importing the Alchemy SDK
const { Network, Alchemy, Wallet, Utils } = require("alchemy-sdk");
// Importing dotenv to read the API key from the .env file
const dotenv = require("dotenv");
dotenv.config();
// Reading the API key and private key from the .env file
const { API_KEY, PRIVATE_KEY } = process.env;
// Configuring the Alchemy SDK
const settings = {
    apiKey: API_KEY, // Replace with your API key.
    network: Network.ETH_SEPOLIA, // Replace with your network.
};
// Creating an instance of the Alchemy SDK
const alchemy = new Alchemy(settings);

// HemeshToken contract address on Sepolia testnet
const tokenContractAddress = "0x85E898150BbdC5Ea166E5Aa327E08FDaD571Cd43";

// ===================== STEP 1: Transfer 100 tokens =====================
async function transferTokens() {
    const wallet = new Wallet(PRIVATE_KEY, alchemy);
    const address = await wallet.getAddress();
    console.log("\n--- STEP 1: Transfer Tokens ---");
    console.log("Your address:", address);

    const toAddress = "0x01C1ca81a00E75321bBFb5abCC8184f40A06D3CD";
    const amountToSend = 100;
    const decimals = 18;

    const abi = ["function transfer(address to, uint256 value)"];
    const iface = new Utils.Interface(abi);
    const data = iface.encodeFunctionData("transfer", [
        toAddress,
        Utils.parseUnits(amountToSend.toString(), decimals),
    ]);

    const feeData = await alchemy.core.getFeeData();
    const transaction = {
        to: tokenContractAddress,
        nonce: await alchemy.core.getTransactionCount(address),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        maxFeePerGas: feeData.maxFeePerGas,
        type: 2,
        chainId: 11155111,
        data: data,
        gasLimit: Utils.parseUnits("250000", "wei"),
    };

    console.log(`Transferring ${amountToSend} HT tokens to ${toAddress}...`);
    const sentTx = await wallet.sendTransaction(transaction);
    console.log("Transaction sent! Hash:", sentTx.hash);
    const receipt = await sentTx.wait();
    console.log("✅ Transfer confirmed in block:", receipt.blockNumber);
}

// ===================== STEP 2: Approve allowance =====================
async function approveAllowance() {
    const wallet = new Wallet(PRIVATE_KEY, alchemy);
    const address = await wallet.getAddress();
    console.log("\n--- STEP 2: Approve Allowance ---");
    console.log("Your address:", address);

    // Address of the person sitting next to you (spender)
    const spenderAddress = "0x01C1ca81a00E75321bBFb5abCC8184f40A06D3CD";
    const amountToApprove = 100;
    const decimals = 18;

    const abi = ["function approve(address spender, uint256 amount)"];
    const iface = new Utils.Interface(abi);
    const data = iface.encodeFunctionData("approve", [
        spenderAddress,
        Utils.parseUnits(amountToApprove.toString(), decimals),
    ]);

    const feeData = await alchemy.core.getFeeData();
    const transaction = {
        to: tokenContractAddress,
        nonce: await alchemy.core.getTransactionCount(address),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        maxFeePerGas: feeData.maxFeePerGas,
        type: 2,
        chainId: 11155111,
        data: data,
        gasLimit: Utils.parseUnits("250000", "wei"),
    };

    console.log(`Approving ${amountToApprove} HT tokens for spender: ${spenderAddress}...`);
    const sentTx = await wallet.sendTransaction(transaction);
    console.log("Transaction sent! Hash:", sentTx.hash);
    const receipt = await sentTx.wait();
    console.log("✅ Approval confirmed in block:", receipt.blockNumber);
}

// ===================== STEP 3: TransferFrom (run by spender) =====================
// NOTE: This function needs the SPENDER's private key in .env to work
async function transferFrom() {
    const wallet = new Wallet(PRIVATE_KEY, alchemy);
    const spenderAddress = await wallet.getAddress();
    console.log("\n--- STEP 3: TransferFrom ---");
    console.log("Spender (caller) address:", spenderAddress);

    // The token owner's address (the one who approved)
    const ownerAddress = "0x623B2a013d804253101A0b1679315c677427AFd1";
    const toAddress = spenderAddress; // Sending to the spender's own address
    const amountToTransfer = 50;
    const decimals = 18;

    const abi = ["function transferFrom(address from, address to, uint256 amount)"];
    const iface = new Utils.Interface(abi);
    const data = iface.encodeFunctionData("transferFrom", [
        ownerAddress,
        toAddress,
        Utils.parseUnits(amountToTransfer.toString(), decimals),
    ]);

    const feeData = await alchemy.core.getFeeData();
    const transaction = {
        to: tokenContractAddress,
        nonce: await alchemy.core.getTransactionCount(spenderAddress),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        maxFeePerGas: feeData.maxFeePerGas,
        type: 2,
        chainId: 11155111,
        data: data,
        gasLimit: Utils.parseUnits("250000", "wei"),
    };

    console.log(`TransferFrom: Moving ${amountToTransfer} HT from ${ownerAddress} to ${toAddress}...`);
    const sentTx = await wallet.sendTransaction(transaction);
    console.log("Transaction sent! Hash:", sentTx.hash);
    const receipt = await sentTx.wait();
    console.log("✅ TransferFrom confirmed in block:", receipt.blockNumber);
}

// ===================== Main Execution =====================
async function main() {
    try {
        // STEP 1: Transfer 100 tokens to the given address
        // await transferTokens();

        // STEP 2: Approve 100 tokens allowance for the person next to you
        await approveAllowance();

        // STEP 3: TransferFrom (needs spender's private key in .env)
        // await transferFrom();

        console.log("\n🎉 All steps completed!");
        console.log("Uncomment the step you want to run in the main() function.");
    } catch (error) {
        console.error("Script Error:", error);
    }
}

main();
