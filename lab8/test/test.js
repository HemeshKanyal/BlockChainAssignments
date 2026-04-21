const { expect } = require("chai");
describe("MyNFT", function () {
    it("Should mint NFT correctly", async function () {
        const NFT = await ethers.getContractFactory("MyNFT");
        const nft = await NFT.deploy();
        await nft.mintNFT("0x623B2a013d804253101A0b1679315c677427AFd1");
        expect(await nft.balanceOf("0x623B2a013d804253101A0b1679315c677427AFd1")).to.equal(1);
    });
});