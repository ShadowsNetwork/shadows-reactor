import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import { useCallback, useEffect, useState } from 'react'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { weiToString } from '@/web3/utils'
import axios from 'axios'
import { ConfigType } from '../../../config'
import { PolyChain } from '@/ShadowsJs/contracts/Bridge/constant'

const config = process.env.CONTRACT_CONFIG as unknown as ConfigType

type BridgeDataProps = {
  fromPolyChain: PolyChain
  toPolyChain: PolyChain
}

const getBridgeFee = async (SrcChainId, Hash, DstChainId) => {
  if (!SrcChainId || !Hash || !DstChainId) {
    return 0
  }

  const result = await axios.post(`${config.bridge.apiBaseUrl}/getfee`, {
    SrcChainId,
    Hash,
    DstChainId
  })

  return result.data['TokenAmount']
}

const useBridgeData = ({
  fromPolyChain,
  toPolyChain
}: BridgeDataProps) => {
  const account = useSelector(getAccount)

  const [allowance, setAllowance] = useState<string>()
  const [balance, setBalance] = useState<string>()
  const [fee, setFee] = useState<string>()

  const fetchData = useCallback(async () => {
    if (!account) {
      return
    }

    const [_allowance, _balance, _fee] = await Promise.all([
      dowsJSConnector.dowsJs.Bridge.allowance(fromPolyChain.dowsTokenAddress, account, fromPolyChain.lockContractAddress),
      dowsJSConnector.dowsJs.Bridge.balanceOf(fromPolyChain.dowsTokenAddress, account),
      getBridgeFee(fromPolyChain.polyChainId, fromPolyChain.dowsTokenAddress, toPolyChain.polyChainId)
    ])

    setAllowance(weiToString(_allowance))
    setBalance(weiToString(_balance))
    setFee(_fee)
  }, [account, fromPolyChain, toPolyChain])

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
