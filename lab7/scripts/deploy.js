async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    const weiAmount = await ethers.provider.getBalance(deployer.address);

    console.log("Account balance:", ethers.formatEther(weiAmount));
    // make sure to replace the "GoofyGoober" reference with your own ERC-20 name!
    const Token = await ethers.getContractFactory("GoofyGoober");
    const token = await Token.deploy();
    console.log("Token address:", token.target);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });