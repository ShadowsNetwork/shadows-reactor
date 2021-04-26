import { getDefaultProvider, Wallet } from 'ethers'
import ContractSettings from '../ContractSettings'

const PrivateKeySigner = (provider, networkId, privateKey) => {
  if (networkId && !provider) {
    provider = getDefaultProvider(ContractSettings.SUPPORTED_NETWORKS[networkId])
  }
  return new Wallet(privateKey, provider || getDefaultProvider())
}

export default PrivateKeySigner
