require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/JzLs_sIi2ruO694q7uqsK",
      accounts: ["41d3ba410a6ca9b53504aceb915acaef68f3d36201d43c00f650cf72e31ac97d"],
    },
  },
};