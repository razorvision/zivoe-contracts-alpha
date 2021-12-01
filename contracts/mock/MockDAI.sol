// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "../libs/ERC20.sol";

//author : dcoder2099

contract MockDai is ERC20 {

	constructor() ERC20("testDAI", "tDAI", 18) {}

	function mint(uint256 _amount) public {
			_mint(msg.sender, _amount);
	}
}
