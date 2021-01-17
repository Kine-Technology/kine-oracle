const BN = require('bignumber.js');
const artifact = artifacts.require("KineOracle");
const priceDataContract = '0x47DacC92982F833E7e24df4DDC562f133E4E90EA';
const reporter = me;
// anchor Tolerance = 200000000000000000 , 17 个0
const anchorToleranceMantissa = new BN(2e17);

// TODO consider anchorPeriod, compound is 1800(seconds)
const anchorPeriod = 60;
const compoundOracle = "0xAbaA3B0396620c41A5360f20ee5Bd8F1dC515D25";

//     FIXED_ETH, 0 /// implies the fixedPrice is a constant multiple of the ETH price (which varies)
//     FIXED_USD, 1/// implies the fixedPrice is a constant multiple of the USD price (which is 1)
//     REPORTER, 2/// implies the price is set by the reporter,
//     REPORTER_ONLY 3, // implies the price is not anchored and rely on reporter post
//     UNISWAP_ONLY 4// implies the price only comes from uniswap instead of reporter
//     COMPOUND 5// implies the price only comes from compound


// if we want to support a price, we must add a config with symbol hash and kToken address,
// because kToken=>symbolHash=>compound config=>compound price

// 1. All kine oracle support token should have config(including kine support token and compound support tokens)
// 2. compound oracle price configs should at least provide config with kToken address and symbolHash,
// and underlying should be address(0)
const configs = [
  // KINE, UNISWAP_ONLY 4
  // "0x29efbd92be462c46e98b70fb4ae10f27d3cc434d","0xBd2AEBAa88370160d3B0Dcb530555CA2DcFED681","0xeb48ef9150b594762681c5b8a89019528e4a6af2dc81fe0a4cc42c194c8cbda1","1000000000000000000","4","0","0x7d2dF74Dd60d4d22bCe736181e216FdF540e8Fe4","false"
  {
    "kToken": "0x72b4e75e8a6f596652dbddd5d1b232f5f5dd6574",
    "underlying": "0xBd2AEBAa88370160d3B0Dcb530555CA2DcFED681",
    "symbolHash": "0xeb48ef9150b594762681c5b8a89019528e4a6af2dc81fe0a4cc42c194c8cbda1",
    "baseUnit": "1000000000000000000",
    "priceSource": 4,
    "fixedPrice": 0,
    "uniswapMarket": "0x7d2dF74Dd60d4d22bCe736181e216FdF540e8Fe4",
    "isUniswapReversed": false
  },
  // tuple(address,address,bytes32,uint256,uint8,uint256,address,bool):
  // "0xf8DB02d757650d38360B18dC98464B91e2F4D545","0xf8DB02d757650d38360B18dC98464B91e2F4D545","0xb4e390f51b7b166e80aa2bd4ca6a7efd11d137edbc0329a84b39d48eaf9f084c","1000000000000000000","3","0","0x0000000000000000000000000000000000000000","false"
  // MCD, REPORTER_ONLY 3
  {
    "kToken": "0x0a6F03E7345B42390614eE070f29e4aABF266331",
    "underlying": "0x0a6F03E7345B42390614eE070f29e4aABF266331",
    "symbolHash": "0xb4e390f51b7b166e80aa2bd4ca6a7efd11d137edbc0329a84b39d48eaf9f084c",
    "baseUnit": "1000000000000000000",
    "priceSource": 3,
    "fixedPrice": 0,
    "uniswapMarket": "0x0000000000000000000000000000000000000000",
    "isUniswapReversed": false
  },
  // EOS, UNISWAP_ONLY 4
  // ["0xA7CD067948dE6cA1Bf5761ffc8D3fcb59De0CF7F","0xf6d57c12328BDd573975ecF557131371E2B6fB30","0x45dec4690263beb66c81a3dff626a29e2c5ed3fc74f6c30ee96b0d6e324b605e","10000000000","4","0","0x07a3F3050A35f93a55EA0538Ef39Ce01B76Ed827","true"]
  {
    "kToken": "0xA7CD067948dE6cA1Bf5761ffc8D3fcb59De0CF7F",
    "underlying": "0xf6d57c12328BDd573975ecF557131371E2B6fB30",
    "symbolHash": "0x45dec4690263beb66c81a3dff626a29e2c5ed3fc74f6c30ee96b0d6e324b605e",
    "baseUnit": "10000000000",
    "priceSource": 4,
    "fixedPrice": 0,
    "uniswapMarket": "0x07a3F3050A35f93a55EA0538Ef39Ce01B76Ed827",
    "isUniswapReversed": true
  },
  // ANC, UNISWAP_ONLY 4
  {
    "kToken": "0x701C051c73246910C441f4522f832e4cF043Fd69",
    "underlying": "0x8B66dc070e5A94E7a3b381211cbdbFa80202dF93",
    "symbolHash": "0xec0b4220991f5a1dcd40e58717198ced41d6b55a371fe91069b750f795cb6133",
    "baseUnit": "10000000000",
    "priceSource": 4,
    "fixedPrice": 0,
    "uniswapMarket": "0xAAFc1fE32183050074F61a91Ea3a87eB52281C19",
    "isUniswapReversed": false
  },
  // ETH, COMPOUND   5
  {
    "kToken": "0xb2E1F083fb566d04bf6eD0be6cB31e3784b013b6",
    "underlying": "0x0000000000000000000000000000000000000000",
    "symbolHash": "0xaaaebeba3810b1e6b70781f14b2d72c1cb89c0b2b320c43bb67ff79f562f5ff4",
    "baseUnit": "1000000000000000000",
    "priceSource": 5,
    "fixedPrice": 0,
    "uniswapMarket": "0x88Cc79DD6490Fe9931F8579FF289dE2d75eE9814",
    "isUniswapReversed": true
  },
  // USDC as USD, COMPOUND, 5, compound support token so underlying and uniswap market is address(0)
  {
    "kToken": "0xb1b67df7ab084c8a238a2c156fc0b644cfbc994c",
    "underlying": "0x0000000000000000000000000000000000000000",
    "symbolHash": "0xd6aca1be9729c13d677335161321649cccae6a591554772516700f986f942eaa",
    "baseUnit": "1000000",
    "priceSource": 5,
    "fixedPrice": 1000000,
    "uniswapMarket": "0x0000000000000000000000000000000000000000",
    "isUniswapReversed": false
  },
  // BTC, COMPOUND 5, 0x680612239d0cfc1da9fdc5820c057952453a1ca8
  {
    "kToken": "0x08daafa279763c6bf8e67e7107e31556dacb208e",
    "underlying": "0x0000000000000000000000000000000000000000",
    "symbolHash": "0xe98e2830be1a7e4156d656a7505e65d08c67660dc618072422e9c78053c261e9",
    "baseUnit": "1000000000000000000",
    "priceSource": 5,
    "fixedPrice": 0,
    "uniswapMarket": "0x0000000000000000000000000000000000000000",
    "isUniswapReversed": false
  }
];

module.exports = (deployer) => {
  deployer.deploy(artifact, priceDataContract, reporter, anchorToleranceMantissa, anchorPeriod, configs, compoundOracle);
};

