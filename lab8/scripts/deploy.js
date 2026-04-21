const hre = require("hardhat");

async function main() {
    console.log("Starting deployment...");

    // 1. Get the contract to deploy
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");

    // 2. Deploy the contract
    const nft = await MyNFT.deploy();
    await nft.waitForDeployment();

    const contractAddress = await nft.getAddress();
    console.log("MyNFT deployed to:", contractAddress);

    // 3. Mint an NFT
    console.log("Minting first NFT...");
    const [deployer] = await hre.ethers.getSigners();
    const tx = await nft.mintNFT(deployer.address);
    await tx.wait();
    console.log("NFT minted to:", deployer.address);

    // 4. Set Token URI
    // IMPORTANT: Replace 'YOUR_JSON_CID' with the CID of your metadata/nft.json file after uploading to IPFS
    const tokenID = 0;
    const jsonCID = "QmTjUUms4ctWpEsgefpAdx2QtLMjecRvr8z6WXyLz8m6pR";
    const tokenURI = `ipfs://${jsonCID}`;

    console.log(`Setting token URI for Token ID ${tokenID}...`);
    const uriTx = await nft.setTokenURI(tokenID, tokenURI);
    await uriTx.wait();

    console.log("Token URI set successfully!");
    console.log("\n--- DEPLOYMENT SUMMARY ---");
    console.log("Contract Address:", contractAddress);
    console.log("Token ID:", tokenID);
    console.log("Token URI:", tokenURI);
    console.log("--------------------------");
    console.log("\nYou can now view this NFT on OpenSea (Testnets) or import it into MetaMask!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
