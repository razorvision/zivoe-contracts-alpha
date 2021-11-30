// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

//modified from OlympusDao
//author : _bing

interface IZIVOEERC20 {
    function burnFrom(address account_, uint256 amount_) external;
}