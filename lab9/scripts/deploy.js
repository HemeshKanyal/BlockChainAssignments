const hre = require("hardhat");

async function main() {
    const factory = await hre.ethers.getContractFactory("AwesomeGame");
    const [owner] = await hre.ethers.getSigners();

    const contract = await factory.deploy();
    await contract.waitForDeployment();

    console.log("Contract deployed to:", contract.target);
    console.log("Deployer:", owner.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});