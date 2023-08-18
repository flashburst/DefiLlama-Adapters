const { sumTokens2 } = require('../helper/unwrapLPs')
const { getLogs } = require('../helper/cache/getLogs')

const abi = {
  sc: "address:sc",
}

const vaultFactories = {
  ethereum: "0x0150b57aa8cc6fcbc110f07eef0c85731d8aacf4",
  arbitrum: "0x0150b57aa8cc6fcbc110f07eef0c85731d8aacf4",
  bsc: "0x0150b57aa8cc6fcbc110f07eef0c85731d8aacf4",
};

const fromBlocks = {
  ethereum: 15912005,
  arbitrum: 54210090,
  bsc: 29123165,
};

const bentoBoxAddress = {
  arbitrum: "0x74c764D41B77DBbb4fe771daB1939B00b146894A"
}

const getBondPrice = async () => {
  const { reserve0, reserve1 } = await getReserves(tokenAddresses.bondPairEth);
  return new BigNumber(reserve1).div(new BigNumber(reserve0));
}

async function tvl(_, block, _1, { api, chain }) {
  const logs = await getLogs({
    api,
    target: vaultFactories[chain], // vault factory
    topic: "VaultDeployed(address,bytes32,string,string)",
    fromBlock: fromBlocks[chain],
    eventAbi: 'event VaultDeployed (address vault, bytes32 coverKey, string name, string symbol)',
  });

  const vaults = logs.map((log) => log.args.vault)
  const tokens = await api.multiCall({
    abi: abi.sc,
    calls: vaults,
  })
  const toa = tokens.map((token, i) => ([token, vaults[i]]))

  console.log(toa);

  const toa2 = []
  if(chain === 'arbitrum'){
    // usdc, treasury
    toa2.push(['0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', '0x808Ca06eEC8d8645386Be4293a7f4428D4994f5B'])
    // npm, treasury
    toa2.push(['0x57f12FE6A4e5fe819eec699FAdf9Db2D06606bB4', '0x808Ca06eEC8d8645386Be4293a7f4428D4994f5B'])
  }

  const vaultTvl = await sumTokens2({ api, tokensAndOwners: toa2, chain, resolveLP: true })

  console.log(vaultTvl);

  return vaultTvl
}

module.exports = {
  methodology: "TVL consists of the total liquidity available in the cover pools",
  start: 1667260800, // Nov 01 2022 @ 12:00am (UTC)
  ethereum: { tvl },
  arbitrum: { tvl },
  bsc: { tvl },
};
