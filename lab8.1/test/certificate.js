const { expect } = require("chai");

describe("CertificateNFT", function () {
    let nft, owner, student;

    beforeEach(async function () {
        const NFT = await ethers.getContractFactory("CertificateNFT");
        [owner, student] = await ethers.getSigners();

        nft = await NFT.deploy();
        await nft.waitForDeployment();
    });

    it("Should mint NFT and return correct tokenURI", async function () {
        const metadataURI = "https://ipfs.io/ipfs/QmTestCID";

        // Mint NFT
        await nft.mintCertificate(student.address, metadataURI);

        // Check owner
        expect(await nft.ownerOf(0)).to.equal(student.address);

        // Check metadata
        expect(await nft.tokenURI(0)).to.equal(metadataURI);
    });
});