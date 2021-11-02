import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import { useCallback, useEffect, useState } from 'react'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { addressAvailable, weiToString, weiToBigNumber } from '@/web3/utils'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { ConfigType } from '../../../config'
import { PolyChain } from '@/types/PolyChain'
import { useQuery } from 'react-query'
import { useRefreshController } from '@/contexts/RefreshControllerContext'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'

const config = process.env.CONTRACT_CONFIG as unknown as ConfigType

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

const useBridgeData = ({
  fromPolyChain,
  toPolyChain,
}: BridgeDataProps) => {
  const { slowRefreshFlag } = useRefreshController()

  const { providerReady, networkReady, chainId } = useWeb3EnvContext()

  const account = useSelector(getAccount)

  const [allowance, setAllowance] = useState<string>()
  const [balance, setBalance] = useState<string>()
  const [availableDows, setAvailableDows] = useState(new BigNumber(0))

  const { data: fee } = useQueryBridgeFee(fromPolyChain.polyChainId, fromPolyChain.dowsTokenAddress, toPolyChain.polyChainId)

  const fetchData = useCallback(async () => {
    if (!addressAvailable(account) || !providerReady || !networkReady) {
      setAllowance(undefined)
      setBalance(undefined)
      return
    }

    const [_allowance, _balance] = await Promise.all([
      dowsJSConnector.dowsJs.Bridge.allowance(fromPolyChain.dowsTokenAddress, account, fromPolyChain.lockContractAddress),
      dowsJSConnector.dowsJs.Bridge.balanceOf(fromPolyChain.dowsTokenAddress, account),
    ])

    if (chainId === 97 || chainId === 56) {
      const _transferableDows = await dowsJSConnector.dowsJs.Synthesizer.transferableShadows(account)
      setAvailableDows(weiToBigNumber(_transferableDows))
    }

    setAllowance(weiToString(_allowance))
    setBalance(weiToString(_balance))
  }, [account, slowRefreshFlag, fromPolyChain, toPolyChain, providerReady, networkReady])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    allowance,
    balance,
    availableDows,
    isBsc: chainId === 97 || chainId === 56,
    fee
  }
}

export default useBridgeData
