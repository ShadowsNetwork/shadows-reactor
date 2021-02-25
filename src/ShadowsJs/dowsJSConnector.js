import ShadowsJS from '@/ShadowsJs/index'
// import { providers } from 'ethers'
// import { INFURA_PROJECT_ID, NETWORK_NAMES, SUPPORTED_WALLETS_MAP } from '@/ShadowsJs/networkHelper'
/* import {
  getEthereumNetwork,
  INFURA_JSON_RPC_URLS,
  SUPPORTED_WALLETS_MAP,
  INFURA_PROJECT_ID,
  PORTIS_APP_ID,
  NETWORK_NAMES,
} from './networkHelper'
import {
  uniswapV1,
  uniswapV2,
  unipoolSETH,
  curvepool,
  curveLPToken,
  synthSummary,
  oldCurvepool,
  iEthRewards,
  iEth4Rewards,
  balancerpool,
  balancerSNXRewards,
  curveSBTC,
  sBTCRewards,
  curveSUSDSwapContract,
  iBtcRewards,
  iBtc2Rewards,
} from './contracts' */

const dowsJSConnector = {
  initialized: false,
  signers: ShadowsJS.signers,
  setContractSettings({ provider, signer, networkId }) {
    this.initialized = true
    this.dowsJs = new ShadowsJS({ provider, signer, networkId })
    this.synths = this.dowsJs.contractSettings.synths
    this.signer = this.dowsJs.contractSettings.signer
    this.provider = this.dowsJs.contractSettings.provider
    this.utils = this.dowsJs.utils
    this.ethersUtils = this.dowsJs.ethers.utils
  },
}

/* const connectToMetamask = async (networkId, networkName) => {
  const walletState = {
    walletType: SUPPORTED_WALLETS_MAP.METAMASK,
    unlocked: false,
  }
  try {
    const accounts = await dowsJSConnector.signer.getNextAddresses()
    if (accounts && accounts.length > 0) {
      return {
        ...walletState,
        currentWallet: accounts[0],
        unlocked: true,
        networkId,
        networkName: networkName.toLowerCase(),
      }
    }
    return {
      ...walletState,
      unlockReason: 'Please connect to Metamask',
    }

    // We updateWalletStatus with all the infos
  } catch (e) {
    console.log(e)
    return {
      ...walletState,
      unlockReason: 'ErrorWhileConnectingToMetamask',
      unlockMessage: e,
    }
  }
} */

/* const connectToCoinbase = async (networkId, networkName) => {
  const walletState = {
    walletType: SUPPORTED_WALLETS_MAP.COINBASE,
    unlocked: false,
  }
  try {
    const accounts = await dowsJSConnector.signer.getNextAddresses()
    if (accounts && accounts.length > 0) {
      return {
        ...walletState,
        currentWallet: accounts[0],
        unlocked: true,
        networkId,
        networkName: networkName.toLowerCase(),
      }
    }
    return {
      ...walletState,
      unlockReason: 'CoinbaseNoAccounts',
    }

    // We updateWalletStatus with all the infos
  } catch (e) {
    console.log(e)
    return {
      ...walletState,
      unlockReason: 'ErrorWhileConnectingToCoinbase',
      unlockMessage: e,
    }
  }
} */

/* const connectToHardwareWallet = (networkId, networkName, walletType) => {
  return {
    walletType,
    unlocked: true,
    networkId,
    networkName: networkName.toLowerCase(),
  }
} */

/* const connectToWalletConnect = async (networkId, networkName) => {
  const walletState = {
    walletType: SUPPORTED_WALLETS_MAP.WALLET_CONNECT,
    unlocked: false,
  }
  try {
    await dowsJSConnector.signer.provider._web3Provider.enable()
    const accounts = await dowsJSConnector.signer.getNextAddresses()
    if (accounts && accounts.length > 0) {
      return {
        ...walletState,
        currentWallet: accounts[0],
        unlocked: true,
        networkId,
        networkName: networkName.toLowerCase(),
      }
    }
  } catch (e) {
    console.log(e)
    return {
      ...walletState,
      unlockReason: 'ErrorWhileConnectingToWalletConnect',
      unlockMessage: e,
    }
  }
} */

/* const connectToPortis = async (networkId, networkName) => {
  const walletState = {
    walletType: SUPPORTED_WALLETS_MAP.PORTIS,
    unlocked: false,
  }
  try {
    const accounts = await dowsJSConnector.signer.getNextAddresses()
    if (accounts && accounts.length > 0) {
      return {
        ...walletState,
        currentWallet: accounts[0],
        unlocked: true,
        networkId,
        networkName: networkName.toLowerCase(),
      }
    }
  } catch (e) {
    console.log(e)
    return {
      ...walletState,
      unlockError: e.message,
    }
  }
} */

/* const getSignerConfig = ({
  type,
  networkId,
  derivationPath,
  networkName,
}) => {
  const customProvider = getProvider({ networkId })
  if (type === SUPPORTED_WALLETS_MAP.LEDGER) {
    const DEFAULT_LEDGER_DERIVATION_PATH = '44\'/60\'/0\'/'
    return {
      derivationPath: derivationPath || DEFAULT_LEDGER_DERIVATION_PATH,
      provider: customProvider,
    }
  }

  if (type === SUPPORTED_WALLETS_MAP.TREZOR) {
    return {
      provider: customProvider,
    }
  }

  if (type === SUPPORTED_WALLETS_MAP.COINBASE) {
    return {
      appName: 'Mintr',
      appLogoUrl: `${window.location.origin}/images/mintr-leaf-logo.png`,
      jsonRpcUrl: INFURA_JSON_RPC_URLS[networkId],
      networkId,
    }
  }
  if (type === SUPPORTED_WALLETS_MAP.WALLET_CONNECT) {
    return {
      infuraId: process.env.REACT_APP_INFURA_PROJECT_ID,
    }
  }
  if (type === SUPPORTED_WALLETS_MAP.PORTIS) {
    return {
      networkName: networkName.toLowerCase(),
      appId: PORTIS_APP_ID,
    }
  }

  return {}
} */

export const setSigner = ({
  // type,
  networkId,
  signer,
  // derivationPath,
  // networkName,
}) => {
  /* const signer = new dowsJSConnector.signers[type](
    getSignerConfig({
      type,
      networkId,
      derivationPath,
      networkName,
    }),
  ) */

  dowsJSConnector.setContractSettings({
    networkId,
    signer,
    provider: signer.provider,
  })
}

/*

export const connectToWallet = async ({
  wallet,
  derivationPath,
}) => {
  const {
    name,
    networkId,
  } = await getEthereumNetwork()
  if (!name) {
    return {
      walletType: '',
      unlocked: false,
      unlockReason: 'NetworkNotSupported',
    }
  }
  setSigner({
    type: wallet,
    networkId,
    derivationPath,
    networkName: name,
  })

  switch (wallet) {
  case SUPPORTED_WALLETS_MAP.METAMASK:
    return connectToMetamask(networkId, name)
  case SUPPORTED_WALLETS_MAP.COINBASE:
    return connectToCoinbase(networkId, name)
  case SUPPORTED_WALLETS_MAP.TREZOR:
  case SUPPORTED_WALLETS_MAP.LEDGER:
    return connectToHardwareWallet(networkId, name, wallet)
  case SUPPORTED_WALLETS_MAP.WALLET_CONNECT:
    return connectToWalletConnect(networkId, name)
  case SUPPORTED_WALLETS_MAP.PORTIS:
    return connectToPortis(networkId, name)
  default:
    return {}
  }
}
*/

// export const getProvider = ({ networkId }) => new providers.InfuraProvider(NETWORK_NAMES[networkId].toLowerCase(), INFURA_PROJECT_ID)

export default dowsJSConnector
