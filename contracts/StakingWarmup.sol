// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import "./libs/IERC20.sol";

//modified from OlympusDao
//author : dcoder2099

contract StakingWarmup {

    address public immutable staking;
    address public immutable sZVE;

    constructor ( address _staking, address _sZVE ) {
        require( _staking != address(0) );
        staking = _staking;
        require( _sZVE != address(0) );
        sZVE = _sZVE;
    }

    function retrieve( address _staker, uint _amount ) external {
        require( msg.sender == staking );
        IERC20( sZVE ).transfer( _staker, _amount );
    }
}