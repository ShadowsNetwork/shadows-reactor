type Target = {
  name: string;
  address: string;
  source: string;
  link: string;
  timestamp: string;
  txn: string;
  network: string;
}

type Abi = {
  constant: boolean,
  inputs: any[],
  name: string,
  outputs: any[]
  payable: boolean,
  stateMutability: string,
  type: string,
  signature: string
}

type Source = {
  bytecode: string,
  abi: Abi[]
}

type Deployment = {
  targets: any;
  sources: any
}

type Synth = {
  name: string;
  asset: string;
  category: string;
  sign: string;
  desc: string;
  aggregator: string;
}

/**
 * Converts a string into a hex representation of bytes32, with right padding
 */
function loadDeploymentFile(network: string): Deployment {
  return require(`../../../contract/publish/deployed/${network}/deployment.json`)
}

function getTarget(network = "mainnet", contract: string): Target {
  const deployment = loadDeploymentFile(network)
  if (contract) return deployment.targets[contract]
  return deployment.targets
}

const getSource = (network = "mainnet", contract: string): Source => {
  const deployment = loadDeploymentFile(network)
  if (contract) return deployment.sources[contract]
  return deployment.sources
}

const getSynths = ({ network = "mainnet" } = {}) => {
  const synths = require(`../../../contract/publish/deployed/${network}/synths.json`)

  // copy all necessary index parameters from the longs to the corresponding shorts
  return synths.map((synth: Synth) => {
    // @ts-ignore
    if (typeof synth.index === "string") {
      // @ts-ignore
      const { index } = synths.find(({ name }) => name === synth.index) || {}
      if (!index) {
        // @ts-ignore
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

export {
  getTarget, getSource, getSynths
}
