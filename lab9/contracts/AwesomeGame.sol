// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract AwesomeGame is ERC1155 {

    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant SWORD = 2;
    uint256 public constant SHIELD = 3;
    uint256 public constant CROWN = 4;
    uint256 public constant TROPHY = 5; // 🎯 NEW NFT PRIZE

    constructor() ERC1155("ipfs://QmQq8LMQhb7tCpckKAWEGyTKB1td5y2JXMoJ49qCVFKd3k/{id}.json") {
        _mint(msg.sender, GOLD, 10**18, "");
        _mint(msg.sender, SILVER, 10**18, "");
        _mint(msg.sender, SWORD, 1000, "");
        _mint(msg.sender, SHIELD, 1000, "");
        _mint(msg.sender, CROWN, 1, "");

        _mint(msg.sender, TROPHY, 1, ""); // 🎯 Winner NFT
    }

    // 🎯 Custom mint function
    function mint(address to, uint256 id, uint256 amount) public {
        _mint(to, id, amount, "");
    }

    // 🎯 Batch mint
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts) public {
        _mintBatch(to, ids, amounts, "");
    }
}