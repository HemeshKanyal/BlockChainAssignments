const hre = require("hardhat");

async function main() {
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const nft = await MyNFT.deploy();

    await nft.waitForDeployment();

    console.log("NFT Contract deployed to:", await nft.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});