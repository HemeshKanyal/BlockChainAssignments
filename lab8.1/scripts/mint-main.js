const hre = require("hardhat");

async function main() {
    const contractAddress = "0x719830be751844f3924Df8b9DD935Dc59aa8a24E";

    const nft = await hre.ethers.getContractAt("MyNFT", contractAddress);

    const tokenURI = "https://ipfs.io/ipfs/QmVgjHrj9m9NgmY8quosWUrKfGPwmT8Lw4d3X3Nexbdacw";

    const address1 = "0x01C1ca81a00E75321bBFb5abCC8184f40A06D3CD";
    const address2 = "0x4B9deBB89d9180Aec4C12561013233248e957AF9";

    const tx1 = await nft.mintNFT(address1, tokenURI);
    await tx1.wait();

    const tx2 = await nft.mintNFT(address2, tokenURI);
    await tx2.wait();

    console.log("NFTs minted to two different addresses!");
}

main();