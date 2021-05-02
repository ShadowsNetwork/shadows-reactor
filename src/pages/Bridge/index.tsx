import LimitableNumberInput from '@/components/LimitableNumberInput'
import React, { useState } from 'react'

import './index.less'
import { useInitializeProvider, useSetupNetwork } from '@/hooks'
import { Button, Input } from 'antd'
import BigNumber from 'bignumber.js'
import useBridgeData from '@/pages/Bridge/useBridgeData'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { toWei } from '@/web3/utils'
import { useDispatch, useSelector } from 'react-redux'
import { getAccount, setChainId, setRpcUrl } from '@/store/wallet'
import { PolyChain } from '@/ShadowsJs/contracts/Bridge/constant'
import { getPolyChainById, getToPolyChainByFromPolyChain } from '@/ShadowsJs/contracts/Bridge/utils'
import { getSourcePolyChainId, setSourcePolyChainId } from '@/store/bridge'
import DOWSIcon from '@/img/dows-info/dows.png'

type BridgeProps = {
  fromPolyChain: PolyChain
  toPolyChain: PolyChain
}

type ChainBridgeProps = {
  fromPolyChain: PolyChain
  toPolyChain: PolyChain
  onSwitch: () => void
}

const ChainBridge: React.FC<ChainBridgeProps> = ({
  fromPolyChain,
  toPolyChain,
  onSwitch
}) => (
  <div className="chain-container">
    <div className="chain">
      <p className="label">from</p>
      <img src={fromPolyChain.icon} alt="" />
      {fromPolyChain.ethereumChain.chainName}
    </div>
    <Button onClick={onSwitch}>SWITCH</Button>
    <div className="chain">
      <p className="label">to</p>
      <img src={toPolyChain.icon} alt="" />
      {toPolyChain.ethereumChain.chainName}
    </div>
  </div>
)

const BridgeMain: React.FC<BridgeProps> = ({
  fromPolyChain,
  toPolyChain
}) => {
  const { dowsTokenAddress, lockContractAddress } = fromPolyChain

  const account = useSelector(getAccount)
  const [amount, setAmount] = useState<string>('')
  const [refreshFlag, setRefreshFlag] = useState(0)

  const { allowance, balance, fee } = useBridgeData({ fromPolyChain, toPolyChain, refreshFlag })

  const allowanceEnough = () => {
    return allowance && new BigNumber(amount).lt(new BigNumber(allowance))
  }

  const isAmountLegal = () => {
    return !amount || (fee && new BigNumber(amount).gt(new BigNumber(fee)))
  }

  const setAmountToMax = () => {
    setAmount(balance!)
  }

  const approve = async () => {
    const approveResult = await dowsJSConnector.dowsJs.Bridge.approve(dowsTokenAddress, lockContractAddress)
    approveResult.wait()
      .then(() => {
        window.location.reload()
      })
  }

  const confirm = async () => {
    const lockResult = await dowsJSConnector.dowsJs.Bridge.lock({
      lockContractAddress,
      fromAsset: dowsTokenAddress,
      toChainId: toPolyChain.polyChainId,
      toAddress: account,
      amount: toWei(amount),
      fee: toWei(fee!)
    })

    lockResult.wait().then(() => {
      setRefreshFlag(refreshFlag + 1)
    })
  }

  return (
    <div className="bridge-main">
      <div className="balance-row">
        <div>
          {balance ?? '-'} DOWS Available
        </div>
      </div>
      <div className="input-row">
        <LimitableNumberInput
          decimalPlaces={18}
          inputValue={amount}
          setInputValue={setAmount}
          max={balance}
        />
        <div className="DOWS">DOWS</div>
        <Button onClick={setAmountToMax}>MAX</Button>
      </div>
      <div className="fee">
        Fee: {fee ?? '-'}
      </div>
      <div className="button">
        {
          amount && (
            allowanceEnough() ?
              <Button onClick={confirm} disabled={!isAmountLegal()}>
                Confirm
              </Button> :
              <Button onClick={approve}>
                APPROVE
              </Button>
          )
        }
        {
          !amount && (
            <Button disabled={true}>
              Confirm
            </Button>
          )
        }
        {
          !isAmountLegal() &&
          <div className="error-hint">
            The input amount must be greater than the fee.
          </div>
        }
      </div>
    </div>
  )
}

const EmptyBridgeMain: React.FC = () => (
  <div className="bridge-main">
    <div className="balance-row">
      <div>
        - DOWS Available
      </div>
    </div>
    <div className="input-row">
      <Input />
      <div className="DOWS">DOWS</div>
      <Button disabled={true}>MAX</Button>
    </div>
    <div className="fee">
      Fee: -
    </div>
    <div className="button">
      <Button disabled={true}>
        Confirm
      </Button>
    </div>
  </div>
)

const Bridge: React.FC = () => {
  const dispatch = useDispatch()
  const fromPolyChainId = useSelector(getSourcePolyChainId)

  const fromPolyChain = getPolyChainById(fromPolyChainId)!
  const toPolyChain = getToPolyChainByFromPolyChain(fromPolyChain)

  dispatch(setChainId(fromPolyChain.networkChainId))
  dispatch(setRpcUrl(fromPolyChain.ethereumChain.rpcUrls[0]))

  const providerInitialized = useInitializeProvider(
    parseInt(fromPolyChain.ethereumChain.chainId, 16),
    fromPolyChain.ethereumChain.rpcUrls[0]
  )

  const networkReady = useSetupNetwork(providerInitialized, fromPolyChain.ethereumChain)

  const onSwitch = () => {
    dispatch(setSourcePolyChainId(toPolyChain.polyChainId))
  }

  return (
    <div className="bridge">
      <div className="title">
        <img src={DOWSIcon} alt="dows" />
        DOWS Bridge
      </div>
      <ChainBridge
        fromPolyChain={fromPolyChain}
        toPolyChain={toPolyChain}
        onSwitch={onSwitch}
      />
      {
        providerInitialized && networkReady ?
          <BridgeMain
            fromPolyChain={fromPolyChain}
            toPolyChain={toPolyChain}
          /> :
          <EmptyBridgeMain />
      }
      {
        !networkReady &&
        <div className="error-hint">
          Please make sure your network is setup to correct
        </div>
      }
    </div>)

}

export default Bridge
