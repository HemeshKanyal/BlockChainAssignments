const hre = require("hardhat");

async function main() {
    const NFT = await hre.ethers.getContractFactory("NFTMintingPlatform");

    const nft = await NFT.deploy(
        100, // max supply
        hre.ethers.parseEther("0.01") // mint fee
    );

    await nft.waitForDeployment();

    console.log("Deployed to:", await nft.getAddress());
}

main();