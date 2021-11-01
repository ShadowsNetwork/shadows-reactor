import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import { useCallback, useEffect, useState } from 'react'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { addressAvailable, weiToString } from '@/web3/utils'
import axios from 'axios'
import { ConfigType } from '../../../config'
import { PolyChain } from '@/types/PolyChain'
import { useQuery } from 'react-query'

const config = process.env.CONTRACT_CONFIG as unknown as ConfigType

type BridgeDataProps = {
  fromPolyChain: PolyChain
  toPolyChain: PolyChain
  refreshFlag: number
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
  refreshFlag
}: BridgeDataProps) => {
  const account = useSelector(getAccount)

  const [allowance, setAllowance] = useState<string>()
  const [balance, setBalance] = useState<string>()

  const { data: fee } = useQueryBridgeFee(fromPolyChain.polyChainId, fromPolyChain.dowsTokenAddress, toPolyChain.polyChainId)

  const fetchData = useCallback(async () => {
    if (!addressAvailable(account)) {
      return
    }

    const [_allowance, _balance] = await Promise.all([
      dowsJSConnector.dowsJs.Bridge.allowance(fromPolyChain.dowsTokenAddress, account, fromPolyChain.lockContractAddress),
      dowsJSConnector.dowsJs.Bridge.balanceOf(fromPolyChain.dowsTokenAddress, account),
    ])

    setAllowance(weiToString(_allowance))
    setBalance(weiToString(_balance))
  }, [account, refreshFlag, fromPolyChain, toPolyChain])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    allowance,
    balance,
    fee
  }
}

export default useBridgeData
