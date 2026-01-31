// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
contract SecureVault is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    mapping(address => uint256) private balances;
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }
    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "Zero value");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
    function withdraw(uint256 amount) external nonReentrant whenNotPaused{
        require(balances[msg.sender] >= amount, "Insufficient");
        balances[msg.sender] -= amount; // CEI: effects first
        (bool ok, ) = msg.sender.call{value: amount}(""); //interaction last
        require(ok, "Transfer failed");
        emit Withdrawn(msg.sender, amount);
    }
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
    function balanceOf(address user) external view returns (uint256){
        return balances[user];
    }
}