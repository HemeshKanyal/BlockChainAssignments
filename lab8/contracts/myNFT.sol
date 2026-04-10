// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract MyNFT is ERC721, Ownable {
 uint256 public tokenCounter;
 constructor() ERC721("MyNFT", "MNFT") {
 tokenCounter = 0;
 }
 function mintNFT(address to) public onlyOwner returns
(uint256) {
 uint256 tokenId = tokenCounter;
 _safeMint(to, tokenId);
 tokenCounter++;
 return tokenId;
 }
}
mapping(uint256 => string) private _tokenURIs;
function setTokenURI(uint256 tokenId, string memory _uri) public
onlyOwner {
 _tokenURIs[tokenId] = _uri;
}
function tokenURI(uint256 tokenId) public view override returns
(string memory) {
 return _tokenURIs[tokenId];
}
{
 "name": "My NFT #1",
 "description": "Blockchain Engineering NFT",
 "image": "ipfs://Qmbafybeigijbpikv34qcki3lqv6ydrlrxwxlj36c7a4wx7aasi2bsjj6kweq"
}
