const web3 = require("web3")
const artifact = artifacts.require("KineOracle");
// const artifact = artifacts.require("PriceConfig");
const priceDataContract = '0x47DacC92982F833E7e24df4DDC562f133E4E90EA';
const reporter = me;
const kaptain = "0x4710f49CdbB09F3b5906C43F466B08d294F45e96";

// anchor Tolerance = 200000000000000000 , 17 个0
const anchorToleranceMantissa = web3.utils.toBN("2e17");

// TODO consider anchorPeriod
const anchorPeriod = 1800;
const compoundOracle = "0xAbaA3B0396620c41A5360f20ee5Bd8F1dC515D25";

//     FIXED_ETH, 0 /// implies the fixedPrice is a constant multiple of the ETH price (which varies)
//     FIXED_USD, 1/// implies the fixedPrice is a constant multiple of the USD price (which is 1)
//     REPORTER, 2/// implies the price is set by the reporter,
//     KAPTAIN 3, // implies the price is not anchored and rely on Kaptain post
//     COMPOUND 4// implies the price only comes from compound


// if we want to support a price, we must add a config with symbol hash and kToken address,
// because kToken=>symbolHash=>compound config=>compound price

// 1. All kine oracle support token should have config(including kine support token and compound support tokens)
// 2. compound oracle price configs should at least provide config with kToken address and symbolHash,
// and underlying should be address(0)

const configs = [
  // KINE, REPORTER 2
  {
    "kToken": "0xe69C5926a1bd96566E67e80c0f7a19371619E0D4",
    "underlying": "0x5991f1c1EB3fc374F65ED948A615504c2aEa967C",
    "symbolHash": "0xeb48ef9150b594762681c5b8a89019528e4a6af2dc81fe0a4cc42c194c8cbda1",
    "baseUnit": "1000000000000000000",
    "priceSource": 2,
    "fixedPrice": 0,
    "uniswapMarket": "0x66B9BEE77D27db7C51d62573efd4017843514ED8",
    "isUniswapReversed": false
  },
  // MCD, KAPTAIN 3
  {
    "kToken": "0x12Bd3a1236D1AE05Cd20EafCBb503F270422BCC8",
    "underlying": "0x2BBa673c96EAf02c533942fa0bC7Bb08ced4A1EF",
    "symbolHash": "0xb4e390f51b7b166e80aa2bd4ca6a7efd11d137edbc0329a84b39d48eaf9f084c",
    "baseUnit": "1000000000000000000",
    "priceSource": 3,
    "fixedPrice": 0,
    "uniswapMarket": "0x0000000000000000000000000000000000000000",
    "isUniswapReversed": false
  },
  // USDT as USD, FIXED_USD, 1
  {
    "kToken": "0x754018854a062A1780966f1aDD21e862e8817eD1",
    "underlying": "0xC70BA587d226374040De741b08A9096EDC6744aE",
    "symbolHash": "0x8b1a1d9c2b109e527c9134b25b1a1833b16b6594f92daa9f6d9b7a6024bce9d0",
    "baseUnit": "1000000",
    "priceSource": 1,
    "fixedPrice": 1000000,
    "uniswapMarket": "0x0000000000000000000000000000000000000000",
    "isUniswapReversed": false
  },
  // ETH, COMPOUND   5
  {
    "kToken": "0x258ba98259ebA5488219f6283fe650ccE9644C66",
    "underlying": "0x0000000000000000000000000000000000000000",
    "symbolHash": "0xaaaebeba3810b1e6b70781f14b2d72c1cb89c0b2b320c43bb67ff79f562f5ff4",
    "baseUnit": "1000000000000000000",
    "priceSource": 4,
    "fixedPrice": 0,
    "uniswapMarket": "0x88Cc79DD6490Fe9931F8579FF289dE2d75eE9814",
    "isUniswapReversed": true
  },
  // USDC as USD, COMPOUND, 5, compound support token so underlying and uniswap market is address(0)
  {
    "kToken": "0x8652BA788fB62a42D0eDa7Ca4A0b9920Db2745E1",
    "underlying": "0x0000000000000000000000000000000000000000",
    "symbolHash": "0xd6aca1be9729c13d677335161321649cccae6a591554772516700f986f942eaa",
    "baseUnit": "1000000",
    "priceSource": 4,
    "fixedPrice": 1000000,
    "uniswapMarket": "0x0000000000000000000000000000000000000000",
    "isUniswapReversed": false
  },
  // BTC, COMPOUND 5
  {
    "kToken": "0xfb651Fabe289bc216aA73595343e20464F04ce02",
    "underlying": "0x0000000000000000000000000000000000000000",
    "symbolHash": "0xe98e2830be1a7e4156d656a7505e65d08c67660dc618072422e9c78053c261e9",
    "baseUnit": "1000000000000000000",
    "priceSource": 4,
    "fixedPrice": 0,
    "uniswapMarket": "0x0000000000000000000000000000000000000000",
    "isUniswapReversed": false
  }
];
const wrappedETHAddress = "0xc778417e063141139fce010982780140aa0cd5ab";
const uniswapFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const kineOracleConfig = {
  "reporter": reporter,
  "kaptain": kaptain,
  "uniswapFactory": uniswapFactory,
  "wrappedETHAddress": wrappedETHAddress,
  "anchorToleranceMantissa": anchorToleranceMantissa,
  "anchorPeriod": anchorPeriod,
}

module.exports = (deployer) => {
  deployer.deploy(artifact, priceDataContract,
    kineOracleConfig,
    configs, compoundOracle);
};