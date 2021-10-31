import { useSelector } from 'react-redux'
import { getChainId, getRpcUrl } from '@/store/wallet/index'

const useStoredWallet = () => {
  const chainId = useSelector(getChainId)
  const RPCUrl = useSelector(getRpcUrl)

  return {
    chainId, RPCUrl
  }
}

export default useStoredWallet
