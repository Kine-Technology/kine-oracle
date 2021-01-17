// My compound oracle
const BN = require('bignumber.js');
const artifact = artifacts.require("UniswapAnchoredView");
const reporter = me;
const priceDataContract = '0x47DacC92982F833E7e24df4DDC562f133E4E90EA';
// anchor Tolerance = 200000000000000000 , 17 个0
const anchorToleranceMantissa = new BN(2e17);
const anchorPeriod = 60;

// enum PriceSource {
//     FIXED_ETH,  0/// implies the fixedPrice is a constant multiple of the ETH price (which varies)
//     FIXED_USD, 1/// implies the fixedPrice is a constant multiple of the USD price (which is 1)
//     REPORTER   2/// implies the price is set by the reporter
// }
const configs = [
  // ETH, REPORTER   2
  {
    "cToken": "0x0000000000000000000000000000000000000101",
    "underlying": "0x0000000000000000000000000000000000000000",
    "symbolHash": "0xaaaebeba3810b1e6b70781f14b2d72c1cb89c0b2b320c43bb67ff79f562f5ff4",
    "baseUnit": "1000000000000000000",
    "priceSource": 2,
    "fixedPrice": 0,
    "uniswapMarket": "0x88Cc79DD6490Fe9931F8579FF289dE2d75eE9814",
    "isUniswapReversed": true
  },
  // USDC as USD, FIXED_USD, 1
  {
    "cToken": "0x0000000000000000000000000000000000000102",
    "underlying": "0x433afe89B4e317bbE708Eef3C1b4FFB9401cED3E",
    "symbolHash": "0xd6aca1be9729c13d677335161321649cccae6a591554772516700f986f942eaa",
    "baseUnit": "1000000",
    "priceSource": 1,
    "fixedPrice": 1000000,
    "uniswapMarket": "0x0000000000000000000000000000000000000000",
    "isUniswapReversed": false
  },
  // BTC, REPORTER 2, 0x680612239d0cfc1da9fdc5820c057952453a1ca8
  {
    "cToken": "0x0000000000000000000000000000000000000103",
    "underlying": "0xB593F5511a2189f44Eb855Be159d3dEc41fe782d",
    "symbolHash": "0xe98e2830be1a7e4156d656a7505e65d08c67660dc618072422e9c78053c261e9",
    "baseUnit": "1000000000000000000",
    "priceSource": 2,
    "fixedPrice": 0,
    "uniswapMarket": "0xDe208Ed5f6fB244a637e9E323D3C8b96EA2f641E",
    "isUniswapReversed": false
  },
  // // EOS, REPORTER 2
  // // "0xf6d57c12328BDd573975ecF557131371E2B6fB30","0xf6d57c12328BDd573975ecF557131371E2B6fB30","0x45dec4690263beb66c81a3dff626a29e2c5ed3fc74f6c30ee96b0d6e324b605e","10000000000","4","0","0x07a3F3050A35f93a55EA0538Ef39Ce01B76Ed827","true"
  // {
  //   "cToken": "0x0000000000000000000000000000000000000104",
  //   "underlying": "0xf6d57c12328BDd573975ecF557131371E2B6fB30",
  //   "symbolHash": "0x45dec4690263beb66c81a3dff626a29e2c5ed3fc74f6c30ee96b0d6e324b605e",
  //   "baseUnit": "10000000000",
  //   "priceSource": 2,
  //   "fixedPrice": 0,
  //   "uniswapMarket": "0x07a3F3050A35f93a55EA0538Ef39Ce01B76Ed827",
  //   "isUniswapReversed": true
  // },
  // // ANC, REPORTER 2
  // {
  //   "cToken": "0x0000000000000000000000000000000000000105",
  //   "underlying": "0x8B66dc070e5A94E7a3b381211cbdbFa80202dF93",
  //   "symbolHash": "0xec0b4220991f5a1dcd40e58717198ced41d6b55a371fe91069b750f795cb6133",
  //   "baseUnit": "10000000000",
  //   "priceSource": 2,
  //   "fixedPrice": 0,
  //   "uniswapMarket": "0xAAFc1fE32183050074F61a91Ea3a87eB52281C19",
  //   "isUniswapReversed": false
  // },
  // // TKN, REPORTER 2
  // {
  //   "cToken": "0x0000000000000000000000000000000000000106",
  //   "underlying": "0xd8b717d1E8ccD0D2680CF0ADC023Bfdc2Dc67537",
  //   "symbolHash": "0x9ee187a325c80a9ca820b4f297a58770bf5a85fede3756f8e7e9d14ff37d7b66",
  //   "baseUnit": "10000000000",
  //   "priceSource": 2,
  //   "fixedPrice": 0,
  //   "uniswapMarket": "0x6827045653cA6441795beD762F7948b975ffB4ba",
  //   "isUniswapReversed": true
  // }
];

module.exports = (deployer) => {
  deployer.deploy(artifact, priceDataContract, reporter, anchorToleranceMantissa, anchorPeriod, configs);
};

