const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying with account:", deployer.address);

    const Credential = await ethers.getContractFactory("Credential");

    const credential = await Credential.deploy(deployer.address);

    await credential.waitForDeployment();

    console.log("Credential deployed to:", await credential.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });