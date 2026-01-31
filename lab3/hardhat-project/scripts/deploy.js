const hre = require("hardhat");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deployer:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log(
        "Deployer balance:",
        hre.ethers.formatEther(balance),
        "ETH"
    );

    // 1️⃣ Deploy
    const SecureVault = await hre.ethers.getContractFactory("SecureVault");
    const secureVault = await SecureVault.deploy(deployer.address);

    await secureVault.waitForDeployment();
    const vaultAddress = await secureVault.getAddress();

    console.log("✅ SecureVault deployed at:", vaultAddress);

    // ⏸️ WAIT so RPC doesn’t choke
    console.log("⏳ Waiting before sending transaction...");
    await sleep(15000); // 15 seconds

    // 2️⃣ Deposit transaction
    console.log("⏳ Sending deposit transaction...");

    const tx = await secureVault.deposit({
        value: hre.ethers.parseEther("0.01"),
    });

    console.log("TX hash:", tx.hash);
    await tx.wait();

    console.log("✅ Deposit confirmed");

    // 3️⃣ Read balance
    const vaultBalance = await secureVault.balanceOf(deployer.address);
    console.log(
        "Vault balance:",
        hre.ethers.formatEther(vaultBalance),
        "ETH"
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});