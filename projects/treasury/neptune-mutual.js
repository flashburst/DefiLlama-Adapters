const ADDRESSES = require('../helper/coreAssets.json')
const { nullAddress, treasuryExports } = require("../helper/treasury");

const treasury = {
  arbitrum: "0x808Ca06eEC8d8645386Be4293a7f4428D4994f5B"
}
const npm = {
  ethereum: "0x57f12FE6A4e5fe819eec699FAdf9Db2D06606bB4",
  arbitrum: "0x57f12FE6A4e5fe819eec699FAdf9Db2D06606bB4"
};

module.exports = treasuryExports({
  ethereum: {
    tokens: [
      nullAddress,
      ADDRESSES.ethereum.USDT, // USDT
      ADDRESSES.ethereum.USDC, // USDC
    ],
    ownTokens: [npm.ethereum],
    owners: [],
  },
  arbitrum: {
    tokens: [
      nullAddress,
      ADDRESSES.arbitrum.USDT, // USDT
      ADDRESSES.arbitrum.USDC, // USDC
    ],
    ownTokens: [npm.arbitrum],
    owners: [treasury.arbitrum],
  }
});
