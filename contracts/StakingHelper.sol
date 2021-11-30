// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import "./libs/IERC20.sol";
import "./libs/interface/IStaking.sol";

//modified from OlympusDao
//author : dcoder2099

contract StakingHelper {

    address public immutable staking;
    address public immutable ZVE;

    constructor ( address _staking, address _ZVE ) {
        require( _staking != address(0) );
        staking = _staking;
        require( _ZVE != address(0) );
        ZVE = _ZVE;
    }

    function stake( uint _amount, address _recipient ) external {
        IERC20( ZVE ).transferFrom( msg.sender, address(this), _amount );
        IERC20( ZVE ).approve( staking, _amount );
        IStaking( staking ).stake( _amount, _recipient );
        IStaking( staking ).claim( _recipient );
    }
}