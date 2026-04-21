const hre = require("hardhat");

async function main() {
    const contractAddress = "0xc7B138B11850e348102f65E1e90337aCE9cF1dB1";

    // Get contract instance
    const nft = await hre.ethers.getContractAt("CertificateNFT", contractAddress);

    // Replace with your IPFS metadata CID
    const metadataURI = "https://ipfs.io/ipfs/QmPVhSFqRjDf7okg7NDeuKnD4LWzdkAgQkqKxQK2UN52Tp";

    // Replace with student's wallet address
    const studentAddress = "0x01C1ca81a00E75321bBFb5abCC8184f40A06D3CD";

    console.log("Minting certificate NFT...");

    const tx = await nft.mintCertificate(studentAddress, metadataURI);
    await tx.wait();

    console.log("✅ NFT minted to:", studentAddress);

    // Verify ownership
    const owner = await nft.ownerOf(0);
    console.log("Owner of token 0:", owner);

    // Verify metadata
    const tokenURI = await nft.tokenURI(0);
    console.log("Token URI:", tokenURI);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});