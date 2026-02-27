require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/JzLs_sIi2ruO694q7uqsK",
      accounts: ["680b51da9780c117e5a2b5ae3243e16eb3720813ab54abd5cc3f6f138366cea1"]
    }
  }
};