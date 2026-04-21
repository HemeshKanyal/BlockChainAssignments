const hre = require("hardhat");

async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const [owner, addr1, addr2] = await hre.ethers.getSigners();

    const nft = await hre.ethers.getContractAt("MyNFT", contractAddress);

    // Mint NFT to addr1
    await nft.mintNFT(addr1.address);

    // Mint NFT to addr2
    await nft.mintNFT(addr2.address);

    console.log("NFTs minted!");
    console.log(await nft.ownerOf(0)); // addr1
    console.log(await nft.ownerOf(1)); // addr2
}

main();