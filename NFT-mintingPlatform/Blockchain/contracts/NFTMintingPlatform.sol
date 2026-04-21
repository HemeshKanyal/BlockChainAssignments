// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract NFTMintingPlatform is ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {
    uint256 public tokenCounter;
    uint256 public maxSupply;
    uint256 public mintFee;
    bool public publicMintEnabled;

    event NFTMinted(address indexed to, uint256 tokenId);

    constructor(uint256 _maxSupply, uint256 _mintFee)
        ERC721("NFTMintingPlatform", "NFP")
        Ownable(msg.sender)
    {
        maxSupply = _maxSupply;
        mintFee = _mintFee;
        tokenCounter = 0;
        publicMintEnabled = false;
    }

    function mintNFT(string memory tokenURI)
        public
        payable
        nonReentrant
        whenNotPaused
    {
        require(publicMintEnabled || msg.sender == owner(), "Minting not allowed");
        require(msg.value >= mintFee, "Insufficient fee");
        require(tokenCounter < maxSupply, "Max supply reached");

        uint256 tokenId = tokenCounter;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        tokenCounter++;

        emit NFTMinted(msg.sender, tokenId);
    }

    // Admin controls
    function togglePublicMint(bool _enabled) public onlyOwner {
        publicMintEnabled = _enabled;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}