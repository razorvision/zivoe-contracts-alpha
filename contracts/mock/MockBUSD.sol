// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "../libs/ERC20.sol";

//modified from MetaversePRO
//author : dcoder2099

contract MockBusd is ERC20 {

	constructor() ERC20("testBUSD", "tBUSD", 18) {}

	function mint(uint256 _amount) public {
			_mint(msg.sender, _amount);
	}
}
