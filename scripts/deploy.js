// @dev. This script will deploy this V1.1 of Olympus. It will deploy the whole ecosystem except for the LP tokens and their bonds. 
// This should be enough of a test environment to learn about and test implementations with the Olympus as of V1.1.
// Not that the every instance of the Treasury's function 'valueOf' has been changed to 'valueOfToken'... 
// This solidity function was conflicting w js object property name

const { ethers } = require("hardhat");

async function main() {

    const [deployer, MockDAO] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Initial staking index
    const initialIndex = '7675210820';

    // First block epoch occurs
    const firstEpochBlock = '8961000';

    // What epoch will be first epoch
    const firstEpochNumber = '338';

    // How many blocks are in each epoch
    const epochLengthInBlocks = '2200';

    // Initial reward rate for epoch
    const initialRewardRate = '3000';

    // Ethereum 0 address, used when toggling changes in treasury
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    // Large number for approval for DAI
    const largeApproval = '100000000000000000000000000000000';

    // Initial mint for DAI (10,000,000)
    const initialMint = '10000000000000000000000000';

    // DAI bond BCV (Bond control variable; see OHM docs)
    const daiBondBCV = '369';

    // Bond vesting length in blocks. 33110 ~ 5 days
    const bondVestingLength = '33110';

    // Min bond price
    const minBondPrice = '50000';

    // Max bond payout
    const maxBondPayout = '50'

    // DAO fee for bond
    const bondFee = '10000';

    // Max debt bond can take on
    const maxBondDebt = '1000000000000000';

    // Initial Bond debt
    const initialBondDebt = '0'

    // Deploy Mock DAI (need real DAI address for mainnet deployment)
    const DAI = await ethers.getContractFactory('MockDAI');
    const dai = await DAI.deploy();

    // Mint 10,000,000 mock DAI
    await dai.mint( deployer.address, initialMint );

    // Deploy ZVE token
    const ZVE = await ethers.getContractFactory('ZivoeERC20Token');
    const zve = await ZVE.deploy();

    // Deploy staked Zivoe token
    /**
      constructor()
     */
      const SZVE = await ethers.getContractFactory('sZivoeERC20Token');
      const sZVE = await SZVE.deploy();
  
    const zve_dai = {address: 0x0} // TODO: Need to figure out what to use as the LP token.

    // Deploy treasury
    /**
      constructor (
        address _ZVE,
        address _DAI,
        address _ZVEDAI,
        uint _blocksNeededForQueue
      )
     */
    const Treasury = await ethers.getContractFactory('ZivoeTreasury'); 
    const treasury = await Treasury.deploy( zve.address, dai.address, zve_dai.address, 0 );

    // Deploy bonding calc
    /**
      constructor( address _ZVE )
     */
    const ZivoeBondingCalculator = await ethers.getContractFactory('ZivoeBondingCalculator');
    const zivoeBondingCalculator = await ZivoeBondingCalculator.deploy( zve.address );

    // Deploy staking distributor
    /**
      constructor( address _treasury, address _ZVE, uint _epochLength, uint _nextEpochBlock ) {
     */
    const Distributor = await ethers.getContractFactory('Distributor');
    const distributor = await Distributor.deploy(treasury.address, zve.address, epochLengthInBlocks, firstEpochBlock);

    // Deploy Staking
    /**
      constructor ( 
        address _ZVE, 
        address _sZVE, 
        uint _epochLength,
        uint _firstEpochNumber,
        uint _firstEpochBlock
      )
     */
    const Staking = await ethers.getContractFactory('ZivoeStaking');
    const staking = await Staking.deploy( zve.address, sZVE.address, epochLengthInBlocks, firstEpochNumber, firstEpochBlock );

    // Deploy staking warmup
    /**
      constructor ( address _staking, address _sZVE )
     */
    const StakingWarmup = await ethers.getContractFactory('StakingWarmup');
    const stakingWarmup = await StakingWarmup.deploy(staking.address, sZVE.address);

    // Deploy staking helper
    /**
      constructor ( address _staking, address _ZVE ) {
     */
    const StakingHelper = await ethers.getContractFactory('StakingHelper');
    const stakingHelper = await StakingHelper.deploy(staking.address, zve.address);

    // Deploy DAI bond
    /**
      constructor ( 
          address _ZVE,
          address _principle,
          address _treasury, 
          address _DAO, 
          address _bondCalculator
      )
     */
    //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treasury contract
    const DAIBond = await ethers.getContractFactory('ZivoeBondDepository');
    const daiBond = await DAIBond.deploy(zve.address, dai.address, treasury.address, MockDAO.address, zeroAddress);

    // TODO: Deploy LP bond

    // queue and toggle DAI bond reserve depositor
    await treasury.queue('0', daiBond.address);
    await treasury.toggle('0', daiBond.address, zeroAddress);

    // Set DAI bond terms
    await daiBond.initializeBondTerms(daiBondBCV, bondVestingLength, minBondPrice, maxBondPayout, bondFee, maxBondDebt, initialBondDebt);

    // Set staking for DAI bond
    await daiBond.setStaking(staking.address, stakingHelper.address);

    // Initialize sZVE and set the index
    await sZVE.initialize(staking.address);
    await sZVE.setIndex(initialIndex);

    // set distributor contract and warmup contract
    await staking.setContract('0', distributor.address);
    await staking.setContract('1', stakingWarmup.address);

    // Set treasury for ZVE token
    await zve.setVault(treasury.address);

    // Add staking contract as distributor recipient
    await distributor.addRecipient(staking.address, initialRewardRate);

    // queue and toggle reward manager
    await treasury.queue('8', distributor.address);
    await treasury.toggle('8', distributor.address, zeroAddress);

    // queue and toggle deployer reserve depositor
    await treasury.queue('0', deployer.address);
    await treasury.toggle('0', deployer.address, zeroAddress);

    // queue and toggle liquidity depositor
    await treasury.queue('4', deployer.address, );
    await treasury.toggle('4', deployer.address, zeroAddress);

    // Approve the treasury to spend DAI
    await dai.approve(treasury.address, largeApproval );

    // Approve dai bonds to spend deployer's DAI
    await dai.approve(daiBond.address, largeApproval );

    // Approve staking and staking helper contact to spend deployer's ZVE
    await zve.approve(staking.address, largeApproval);
    await zve.approve(stakingHelper.address, largeApproval);

    // Deposit 9,000,000 DAI to treasury, 600,000 ZVE gets minted to deployer and 8,400,000 are in treasury as excess reserves
    await treasury.deposit('9000000000000000000000000', dai.address, '8400000000000000');

    // Stake ZVE through helper
    await stakingHelper.stake('100000000000');

    // Bond 1,000 ZVE in each bond
    await daiBond.deposit('1000000000000000000000', '60000', deployer.address );

    console.log( "ZVE: " + zve.address );
    console.log( "DAI: " + dai.address );
    console.log( "Treasury: " + treasury.address );
    console.log( "Calc: " + zivoeBondingCalculator.address );
    console.log( "Staking: " + staking.address );
    console.log( "sZVE: " + sZVE.address );
    console.log( "Distributor: " + distributor.address );
    console.log( "Staking Warmup: " + stakingWarmup.address );
    console.log( "Staking Helper: " + stakingHelper.address );
    console.log( "DAI Bond: " + daiBond.address );
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})