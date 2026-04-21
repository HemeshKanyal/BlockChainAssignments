const hre = require("hardhat");

async function main() {
    // Get deployer account (your MetaMask)
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying with account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Balance:", hre.ethers.formatEther(balance), "ETH");

    // Get contract
    const CertificateNFT = await hre.ethers.getContractFactory("CertificateNFT");

    // Deploy
    const contract = await CertificateNFT.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();

    console.log("✅ CertificateNFT deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});