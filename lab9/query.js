const { ethers } = require("hardhat");
async function main() {
  const Game = await ethers.getContractFactory("AwesomeGame");
  const game = Game.attach("0x65206E55dcE7D586Ace6371b7ec253Ab6657acC0");
  console.log("URI:", await game.uri(2));
}
main().catch(console.error);
