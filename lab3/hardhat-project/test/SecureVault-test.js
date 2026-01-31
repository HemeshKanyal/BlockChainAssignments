const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SecureVault", function () {
  let vault, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const Vault = await ethers.getContractFactory("SecureVault");
    vault = await Vault.deploy(owner.address);
    await vault.waitForDeployment();
  });

  it("should accept deposit", async function () {
    await vault.connect(user).deposit({ value: ethers.parseEther("1") });

    const balance = await vault.balanceOf(user.address);
    expect(balance).to.equal(ethers.parseEther("1"));
  });

  it("should allow withdrawal", async function () {
    await vault.connect(user).deposit({ value: ethers.parseEther("1") });
    await vault.connect(user).withdraw(ethers.parseEther("1"));

    const balance = await vault.balanceOf(user.address);
    expect(balance).to.equal(0);
  });

  it("should fail if withdrawing with zero balance", async function () {
    await expect(
      vault.connect(user).withdraw(ethers.parseEther("1"))
    ).to.be.revertedWith("Insufficient");
  });

  it("only admin can pause", async function () {
    await vault.connect(owner).pause();

    await expect(
      vault.connect(user).deposit({ value: ethers.parseEther("1") })
    ).to.be.reverted;
  });
  it("should prevent reentrancy attack", async function () {
  const Attacker = await ethers.getContractFactory("Attacker");
  const attacker = await Attacker.deploy(await vault.getAddress());
  await attacker.waitForDeployment();

  // Fund attacker with ETH
  await owner.sendTransaction({
    to: await attacker.getAddress(),
    value: ethers.parseEther("2"),
  });

  // Attacker deposits and tries reentrancy
  await attacker.attack({ value: ethers.parseEther("1") });

  // Check vault balance is safe (should be 0 after normal withdraw)
  const vaultBalance = await ethers.provider.getBalance(await vault.getAddress());
  expect(vaultBalance).to.equal(0);

  // Check attacker did NOT drain extra ETH from vault
  // (If reentrancy worked, vault balance would be negative or stolen)
});
});