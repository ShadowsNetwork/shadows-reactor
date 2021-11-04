import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { addressAvailable, weiToBigNumber, weiToString } from '@/web3/utils'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { PolyChain } from '@/types/PolyChain'
import { useQuery } from 'react-query'
import { useRefreshController } from '@/contexts/RefreshControllerContext'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'
import { useWeb3React } from '@web3-react/core'

import config from '@/config'

type BridgeDataProps = {
  fromPolyChain: PolyChain
  toPolyChain: PolyChain
}

const useQueryBridgeFee = (SrcChainId, Hash, DstChainId) => {
  return useQuery(['BRIDGE_FEE', SrcChainId, Hash, DstChainId], async () => {
    if (!SrcChainId || !Hash || !DstChainId) {
      return 0
    }

    const result = await axios.post(`${config.bridge.apiBaseUrl}/getfee`, {
      SrcChainId,
      Hash,
      DstChainId
    })

    return result.data['TokenAmount']
  })
}

export type BridgeData = {
  allowance?: string
  balance?: string
  isBsc?: boolean
  fee?: string
  availableDows?: BigNumber
}

const useBridgeData = ({ fromPolyChain, toPolyChain }: BridgeDataProps) => {
  const { account } = useWeb3React()
  const { slowRefreshFlag } = useRefreshController()
  const { providerReady, networkReady, chainId } = useWeb3EnvContext()
  const { data: fee } = useQueryBridgeFee(fromPolyChain.polyChainId, fromPolyChain.dowsTokenAddress, toPolyChain.polyChainId)

  return useQuery<BridgeData>(
    ['BRIDGE_DATA', account, slowRefreshFlag, fromPolyChain, toPolyChain, providerReady, networkReady, fee],
    async () => {
      if (!addressAvailable(account) || !providerReady || !networkReady) {
        return {
          fee
        }
      }

      const [_allowance, _balance] = await Promise.all([
        dowsJSConnector.dowsJs.Bridge.allowance(fromPolyChain.dowsTokenAddress, account, fromPolyChain.lockContractAddress),
        dowsJSConnector.dowsJs.Bridge.balanceOf(fromPolyChain.dowsTokenAddress, account),
      ])

      let availableDows: BigNumber = new BigNumber(0)
      if (chainId === 97 || chainId === 56) {
        const _transferableDows = await dowsJSConnector.dowsJs.Synthesizer.transferableShadows(account)
        availableDows = weiToBigNumber(_transferableDows)
      }

      return {
        allowance: weiToString(_allowance),
        balance: weiToString(_balance),
        isBsc: chainId === 97 || chainId === 56,
        availableDows,
        fee
      }
    }
  )
}

export default useBridgeData
