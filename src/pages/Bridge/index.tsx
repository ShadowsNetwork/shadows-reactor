import LimitableNumberInput from '@/components/LimitableNumberInput'
import React, { useState } from 'react'

import './index.less'
import { useInitializeProvider, useSetupNetwork } from '@/hooks'
import { Button } from 'antd'
import BigNumber from 'bignumber.js'
import useBridgeData from '@/pages/Bridge/useBridgeData'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { toWei } from '@/web3/utils'
import { useDispatch, useSelector } from 'react-redux'
import { getAccount, setChainId, setRpcUrl } from '@/store/wallet'
import { POLY_CHAINS, PolyChain } from '@/ShadowsJs/contracts/Bridge/constant'
import { getToPolyChainByFromPolyChain } from '@/ShadowsJs/contracts/Bridge/utils'

type BridgeProps = {
  networkReady: boolean
  providerInitialized: boolean
  fromPolyChain: PolyChain
  toPolyChain: PolyChain
  onSwitch: () => void
}

const Bridge: React.FC<BridgeProps> = ({
  networkReady,
  providerInitialized,
  fromPolyChain,
  toPolyChain,
  onSwitch
}) => {
  const account = useSelector(getAccount)

  const { dowsTokenAddress, lockContractAddress } = fromPolyChain

  const [amount, setAmount] = useState<string>('')

  const { allowance, balance, fee } = useBridgeData({
    fromPolyChain,
    providerInitialized,
    toPolyChain
  })

  const allowanceEnough = () => {
    return new BigNumber(amount).lt(new BigNumber(allowance))
  }

  const approve = async () => {
    const approveResult = await dowsJSConnector.dowsJs.Bridge.approve(dowsTokenAddress, lockContractAddress)
    approveResult.wait().then(() => {
      window.location.reload()
    })
  }

  const confirm = async () => {
    await dowsJSConnector.dowsJs.Bridge.lock({
      lockContractAddress,
      fromAsset: dowsTokenAddress,
      toChainId: toPolyChain.polyChainId,
      toAddress: account,
      amount: toWei(amount),
      fee: toWei(fee)
    })
  }

  return (
    <div className="bridge">
      <div className="chain-container">
        <div className="chain">
          {fromPolyChain.ethereumChain.chainName}
        </div>
        <Button onClick={onSwitch}>SWITCH</Button>
        <div className="chain">
          {toPolyChain.ethereumChain.chainName}
        </div>
      </div>
      {
        providerInitialized && (
          <div className="bridge-main">
            <div>
              amount:
              <LimitableNumberInput
                disabled={!networkReady}
                inputValue={amount}
                inputValueSetter={setAmount}
                max={balance}
              />
              {
                amount && (
                  allowanceEnough()
                    ? <Button onClick={confirm}>
                      Confirm
                    </Button>
                    : <Button onClick={approve}>
                      APPROVE
                    </Button>
                )
              }
              {
                !amount && <Button disabled={true}>
                  Confirm
                </Button>
              }
            </div>
            <div>
              balance: {balance}
            </div>
            <div>
              fee: {fee}
            </div>
          </div>
        )
      }
    </div>
  )
}

const BridgeWrapper: React.FC = () => {
  // const [defaultPolyChain] = POLY_CHAINS
  const [defaultPolyChain] = POLY_CHAINS

  const [fromPolyChain, setFromPolyChain] = useState(defaultPolyChain)
  const [toPolyChain, setToPolyChain] = useState(getToPolyChainByFromPolyChain(defaultPolyChain))

  const dispatch = useDispatch()
  dispatch(setChainId(defaultPolyChain.networkChainId))
  dispatch(setRpcUrl(defaultPolyChain.ethereumChain.rpcUrls[0]))

  const providerInitialized = useInitializeProvider(
    parseInt(fromPolyChain.ethereumChain.chainId, 16),
    fromPolyChain.ethereumChain.rpcUrls[0]
  )

  const networkReady = useSetupNetwork(providerInitialized, fromPolyChain.ethereumChain)

  const onSwitch = () => {
    setFromPolyChain(toPolyChain)
    setToPolyChain(getToPolyChainByFromPolyChain(toPolyChain))
  }

  return (
    <>
      {
        <Bridge
          networkReady={networkReady}
          providerInitialized={providerInitialized}
          fromPolyChain={fromPolyChain}
          toPolyChain={toPolyChain}
          onSwitch={onSwitch}
        />
      }
    </>
  )
}

export default BridgeWrapper
