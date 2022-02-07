import { JsonFragment } from '@ethersproject/abi'

export type Target = {
  name: string;
  address: string;
  source: string;
  link: string;
  timestamp: string;
  txn: string;
  network: string;
}

type Source = {
  bytecode: string,
  abi: Array<JsonFragment>
}

type Deployment = {
  targets: any;
  sources: any;
}

type Synth = {
  index: unknown;
  name: string;
  asset: string;
  category: string;
  sign: string;
  desc: string;
  aggregator: string;
}

/**
 * @deprecated
 */
function loadDeploymentFile(network: string): Deployment {
  return require(`../../../contract/publish/deployed/${network}/deployment.json`)
}

/**
 * @deprecated
 */
function getTarget(network = 'mainnet', contract: string): Target | Target[] {
  const deployment: Deployment = loadDeploymentFile(network)
  if (contract) return deployment.targets[contract]
  return deployment.targets
}

/**
 * @deprecated
 */
const getSource = (network = 'mainnet', contract: string): Source | undefined => {
  const deployment = loadDeploymentFile(network)
  if (contract) return deployment.sources[contract]
  return deployment.sources
}

/**
 * @deprecated
 */
const getSynths = ({ network = 'mainnet' } = {}): Synth[] => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const synths: Synth[] = require(`../../../contract/publish/deployed/${network}/synths.json`)

  // copy all necessary index parameters from the longs to the corresponding shorts
  return synths.map((synth: Synth) => {
    if (typeof synth.index === 'string') {
      const { index } = synths.find(({ name }) => name === synth.index) || {}
      if (!index) {
        throw Error(`While processing ${synth.name}, it's index mapping "${synth.index}" cannot be found - this is an error in the deployment config and should be fixed`)
      }
      return {
        ...synth,
        index
      }
    }
    return synth
  })
}

type ContractConfig = {
  address: string,
  abi: Array<JsonFragment>
}

function getContractConfig(network: string, contractName: string): ContractConfig {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(`../../../contract/publish/deployed/${network}/config.json`)

    const { contracts } = config

    const contract = contracts[contractName]
    const proxyContract = contracts[`${contractName}_Proxy`]
    if (proxyContract) {
      contract.address = proxyContract.address
    }

    return contract
  } catch (e) {
    return {
      address: '',
      abi: []
    }
  }
}

export {
  getTarget, getSource, getSynths, getContractConfig
}
