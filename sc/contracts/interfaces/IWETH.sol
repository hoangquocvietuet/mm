// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title IWETH
 * @dev Interface for Wrapped Ether (WETH) or Wrapped BNB (WBNB)
 */
interface IWETH {
    function deposit() external payable;
    function withdraw(uint256) external;
    function totalSupply() external view returns (uint);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address spender, uint amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}
