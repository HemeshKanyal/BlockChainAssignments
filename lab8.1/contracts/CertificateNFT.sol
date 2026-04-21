// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721, Ownable {
    uint256 public tokenCounter;

    // Mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("UniversityCertificate", "UCERT") Ownable(msg.sender) {
    tokenCounter = 0;
}

    // Mint certificate NFT
    function mintCertificate(address student, string memory uri) public onlyOwner {
        uint256 tokenId = tokenCounter;

        _safeMint(student, tokenId);
        _setTokenURI(tokenId, uri);

        tokenCounter++;
    }

    // Set token URI
    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        _tokenURIs[tokenId] = uri;
    }

    // Get metadata
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_ownerOf(tokenId) != address(0), "Token does not exist");
    return _tokenURIs[tokenId];
}
}