// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.6.10;

pragma experimental ABIEncoderV2;

import "./Ownable.sol";

/// @title Oracle config for Kine Oracle
/// @author Kine
contract PriceConfig is Ownable {
    /// @dev Describe how to interpret the fixedPrice in the TokenConfig.
    enum KPriceSource {
        FIXED_ETH, /// implies the fixedPrice is a constant multiple of the ETH price (which varies)
        FIXED_USD, /// implies the fixedPrice is a constant multiple of the USD price (which is 1)
        REPORTER, /// implies the price is set by the reporter,
        REPORTER_ONLY, /// implies the price is not anchored and rely on reporter post
        UNISWAP_ONLY, /// implies the price only comes from uniswap instead of reporter
        COMPOUND /// implies the price only comes from compound oracle
    }

    /// @notice Describe how the USD price should be determined for an asset.
    /**
      * @dev There should be 1 KTokenConfig object for each supported asset, passed in the constructor.
      * if the underlying is not priced in KineOracle (i.e. is from compound oracle), this should be address(0)
      */
    struct KTokenConfig {
        address kToken;
        address underlying;
        bytes32 symbolHash;
        uint baseUnit;
        KPriceSource priceSource;
        uint fixedPrice;
        address uniswapMarket;
        bool isUniswapReversed;
    }

    /// @dev The dynamic config array
    KTokenConfig[] public kTokenConfigs;

    function getKConfigIndexByKToken(address kToken) public view returns (uint){
        for (uint i = 0; i < kTokenConfigs.length; i++) {
            KTokenConfig memory config = kTokenConfigs[i];
            if (config.kToken == kToken) {
                return i;
            }
        }
        return uint(-1);
    }

    function getKConfigIndexByUnderlying(address underlying) public view returns (uint){
        for (uint i = 0; i < kTokenConfigs.length; i++) {
            KTokenConfig memory config = kTokenConfigs[i];
            if (config.underlying == underlying) {
                return i;
            }
        }
        return uint(-1);
    }

    function getKConfigIndexBySymbolHash(bytes32 symbolHash) public view returns (uint){
        for (uint i = 0; i < kTokenConfigs.length; i++) {
            KTokenConfig memory config = kTokenConfigs[i];
            if (config.symbolHash == symbolHash) {
                return i;
            }
        }
        return uint(-1);
    }


    // This should only be called before getting the compound price
    // so that if config not found in compound later, compound will revert
    function getKConfigByKToken(address kToken) public view returns (KTokenConfig memory) {
        uint index = getKConfigIndexByKToken(kToken);
        if (index != uint(-1)) {
            return kTokenConfigs[index];
        }
    }

    /**
     * @notice Get the config for symbol
     * @param symbol The symbol of the config to get
     * @return The config object
     */
    function getKTokenConfigBySymbol(string memory symbol) public view returns (KTokenConfig memory) {
        return getKTokenConfigBySymbolHash(keccak256(abi.encodePacked(symbol)));
    }

    /**
     * @notice Get the config for the symbolHash
     * @param symbolHash The keccack256 of the symbol of the config to get
     * @return The config object
     */
    function getKTokenConfigBySymbolHash(bytes32 symbolHash) public view returns (KTokenConfig memory) {
        uint index = getKConfigIndexBySymbolHash(symbolHash);
        if (index != uint(-1)) {
            return kTokenConfigs[index];
        }
    }
}