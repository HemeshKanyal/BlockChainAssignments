const hre = require("hardhat");

async function main() {
    // Get deployer (your MetaMask account)
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contract with account:", deployer.address);

    // Check balance (optional but useful)
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

    // Get contract factory
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");

    // Deploy contract
    const nft = await MyNFT.deploy();

    await nft.waitForDeployment();

    const contractAddress = await nft.getAddress();

    console.log("✅ NFT Contract deployed to:", contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});