# Run Book

Note: This run-book has been compiled from an analysis of the deployment script in the OHM repo. Several of the values used during contract deployment are specious.

It may be important to examine the live contracts on Etherscan to determine more reasonable values for deploying these contracts to the mainnet.

1. Determine the addresses of the deployer and the DAO.
1. Deploy the `ZVE` and `sZVE` tokens.
1. Identify the address of the treasury-backing token (`DAI`?)
1. Identify the address of the treasury-backing LP token (`ZVE-DAI`).
    - See [this post](https://docs.boltdollar.finance/gitbook/general/liquidity-and-lp-tokens/creating-an-lp-token) about creating LP tokens.
    - Will need to have the ZVE token deployed.
1. Determine the "blocks needed for queue" value.
    - Needed for Treasury deployment.
    - `OHM` used 6000 in their treasury.
    - `META` used 0 in theirs.
1. Deploy the Treasury contract.
    - Requires `ZVE`, `DAI`, and `ZVE-DAI` LP token addresses.
1. Deploy the Bond Calculator contract.
    - Requires `ZVE` token address.
1. Deploy the Staking Distributor contract.
    - Requires the address of the treasury contract and `ZVE` token.
    - Requires a value for "epoch length in blocks".
    - Requires a value for "first epoch block".
1. Deploy the Staking contract.
    - Requires the same as the Distributor contract, plus "first epoch number".
1. Deploy the Staking Warmup contract.
    - Requires the addresses of the staking contract and the `sZVE` token.
1. Deploy  the Staking Helper contract.
    - Requires the same as the Staking Warmup contract.
1. Deploy the `DAI` Bond contract.
    - _details tbd_
1. Deploy the `ZVE-DAI` LP Bond contract.
    - _details tbd_
1. Queue and toggle each bond in the treasury.
    - _details tbd_
1. Initialize the bond terms for each bond.
    - _details tbd_
1. Set the staking and helper addresses for each bond.
    - Requires addresses of the Staking and Staking Helper contracts.
1. Initialize the `sZVE` token and set its initial index.
    - Requires address of Staking contract and the value for the "initial index"
1. Set distributor and warmup contracts on the Staking contract.
    - _details tbd_
1. Set the vault on the `ZVE` token to the treasury address.
    - Requires the address of the Treasury contract.
1. Add Staking contract as a recipient on the Distributor contract.
    - Requires Staking contract address and "initial reward rate".
1. Queue and toggle the reward manager
    - Requires the address of the Distributor contract, and the zero address.
1. Queue and toggle the deployer as reserve depositor
    - Requires the address of the deployer and the zero address.
1. Queue and toggle the deployer as liquidity depositor
    - Requires the address of the deployer and the zero address.

## Extra

These steps are in the `scripts/deploy.js` script, but they may be a part of the test-harness setup. We will need to figure out what, if any, additional steps for spending approval and initial deposit reserves to the treasury.

1. Approve treasury to spend DAI.
    - Requires `DAI` contract, the Treasury contract address, and the amount of the "large approval".
1. Approve `DAI` bonds to spend deployer's `DAI`.
    - Requires `DAI` contract, the `DAI` bond address, and "large approval" amount.
1. Approve Staking and Staking Helper contracts to spend `ZVE`.
    - Requires `ZVE` contract, addresses of the staking and helper contracts, and "large approval" amount.
1. Deposit `DAI` into the Treasury.
    - _details tbd_
1. Stake `ZVE`
    - _details tbd_
1. Bond `ZVE`
    - _details tbd_
