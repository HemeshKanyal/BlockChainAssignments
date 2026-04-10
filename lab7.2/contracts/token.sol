// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HemeshToken is ERC20 {
    constructor() ERC20("Hemesh", "HT") {
        _mint(msg.sender, 100000 * (10 ** 18));
    }
}

