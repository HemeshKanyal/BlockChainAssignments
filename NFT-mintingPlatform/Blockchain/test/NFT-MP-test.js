import pkg from "hardhat";
const { ethers } = pkg;
import { expect } from "chai";

describe("NFTMintingPlatform", function () {
    let nft, owner, user;

    beforeEach(async function () {
        const NFT = await ethers.getContractFactory("NFTMintingPlatform");
        [owner, user] = await ethers.getSigners();

        nft = await NFT.deploy(2, ethers.parseEther("0.01"));
        await nft.waitForDeployment();

        await nft.togglePublicMint(true);
    });

    it("Mint with correct fee", async function () {
        await nft.connect(user).mintNFT("ipfs://test", {
            value: ethers.parseEther("0.01"),
        });

        expect(await nft.ownerOf(0)).to.equal(user.address);
    });

    it("Reject mint when supply exceeded", async function () {
        await nft.connect(user).mintNFT("ipfs://1", { value: ethers.parseEther("0.01") });
        await nft.connect(user).mintNFT("ipfs://2", { value: ethers.parseEther("0.01") });

        await expect(
            nft.connect(user).mintNFT("ipfs://3", { value: ethers.parseEther("0.01") })
        ).to.be.revertedWith("Max supply reached");
    });

    it("Pause functionality works", async function () {
        await nft.pause();

        await expect(
            nft.connect(user).mintNFT("ipfs://test", {
                value: ethers.parseEther("0.01"),
            })
        ).to.be.reverted;
    });
});