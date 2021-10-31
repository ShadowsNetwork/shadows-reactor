import LimitableNumberInput from '@/components/LimitableNumberInput'
import React, { useEffect, useState } from 'react'

import './index.less'
import { useErrorMessage } from '@/hooks'
import { Button, Input } from 'antd'
import BigNumber from 'bignumber.js'
import useBridgeData from '@/hooks/useBridgeData'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { toWei } from '@/web3/utils'
import { useDispatch, useSelector } from 'react-redux'
import {
  appendTransactionHistory, getAccount, updateTransactionHistoryStatus
} from '@/store/wallet'
import { getSourcePolyChainId, setSourcePolyChainId } from '@/store/bridge'
import DOWSIcon from '@/img/dows-info/dows.png'
import switchImg from '@/img/bridge/switch.png'
import { ApproveToken, BridgeDows, TransactionStatus } from '@/types/TransactionHistory'
import { PolyChain } from '@/types/PolyChain'
import { getPolyChainById, getToPolyChainByFromPolyChain } from '@/utils/bridgeUtils'
import { useTransactionStatusModal } from '@/contexts/TransactionStatusModalContext'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'

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
      <p className="label">From</p>
      <div className="chainContent">
        <img src={fromPolyChain.icon} alt="" />
        <span>{fromPolyChain.ethereumChain.chainName}</span>
      </div>
    </div>
    <img
      className="switch"
      onClick={onSwitch}
      src={switchImg}
      style={{ cursor: 'pointer' }}
      alt="switch"
    />
    <div className="chain">
      <p className="label">To</p>
      <div className="chainContent">
        <img src={toPolyChain.icon} alt="" />
        <span>{toPolyChain.ethereumChain.chainName}</span>
      </div>
    </div>
  </div>
)

const BridgeMain: React.FC<BridgeProps> = ({
  fromPolyChain,
  toPolyChain
}) => {
  const { dowsTokenAddress, lockContractAddress } = fromPolyChain

  const dispatch = useDispatch()
  const getErrorMessage = useErrorMessage()
  const account = useSelector(getAccount)
  const [amount, setAmount] = useState<string>('')
  const [refreshFlag, setRefreshFlag] = useState(0)

  const { allowance, balance, fee } = useBridgeData({ fromPolyChain, toPolyChain, refreshFlag })

  const { beginTransaction, rejectTransaction, submitTransaction } = useTransactionStatusModal()

  const allowanceEnough = () => {
    return allowance && new BigNumber(amount).lt(new BigNumber(allowance))
  }

  const isAmountLegal = () => {
    return !amount || (fee && new BigNumber(amount).gt(new BigNumber(fee)))
  }

  const setAmountToMax = () => {
    setAmount(balance!)
  }

  const forceRefreshData = () => {
    setRefreshFlag(new Date().getMilliseconds())
  }

  const approve = async () => {
    try {
      beginTransaction()
      const approveResult = await dowsJSConnector.dowsJs.Bridge.approve(dowsTokenAddress, lockContractAddress)
      submitTransaction()

      const transactionHistory = new ApproveToken(approveResult.hash, 'DOWS', fromPolyChain.explorerUrl, TransactionStatus.Submitted)
      dispatch(appendTransactionHistory(transactionHistory))

      approveResult.wait()
        .then(() => {
          transactionHistory.complete()
          dispatch(updateTransactionHistoryStatus(transactionHistory))
          forceRefreshData()
        })
    } catch (e) {
      rejectTransaction(getErrorMessage(e))
    }
  }

  const convert = async () => {
    try {
      beginTransaction()
      const lockResult = await dowsJSConnector.dowsJs.Bridge.lock({
        lockContractAddress,
        fromAsset: dowsTokenAddress,
        toChainId: toPolyChain.polyChainId,
        toAddress: account,
        amount: toWei(amount),
        fee: toWei(fee!)
      })
      submitTransaction()

      const transactionHistory = new BridgeDows(lockResult.hash, amount, fromPolyChain.ethereumChain.chainName, toPolyChain.ethereumChain.chainName, TransactionStatus.Submitted)
      dispatch(appendTransactionHistory(transactionHistory))

      lockResult.wait()
        .then(() => {
          setAmount('')
          forceRefreshData()
        })
    } catch (e) {
      rejectTransaction(getErrorMessage(e))
    }
  }

  return (
    <div className="bridge-main">
      <div className="balance-row">
        <div className="available">
          {balance ?? '-'} DOWS Available
        </div>
      </div>
      <div className="input-row">
        <LimitableNumberInput
          decimalPlaces={18}
          inputValue={amount}
          setInputValue={setAmount}
          maximum={balance}
        />
        <div className="DOWS">DOWS</div>
        <Button onClick={setAmountToMax}>MAX</Button>
      </div>
      <div className="fee">
        Fee: {fee ?? '-'} DOWS
      </div>
      <div className="convert-button">
        {
          amount && (
            allowanceEnough() ?
              <Button onClick={convert} disabled={!isAmountLegal()}>
                Convert
              </Button> :
              <Button onClick={approve}>
                Approve
              </Button>
          )
        }
        {
          !amount && (
            <Button disabled={true}>
              Convert
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
      <div className="available">
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
    <div className="convert-button">
      <Button disabled={true}>
        Convert
      </Button>
    </div>
  </div>
)

const Bridge: React.FC = () => {
  const { providerInitialized, networkReady, setup } = useWeb3EnvContext()

  const dispatch = useDispatch()
  const fromPolyChainId = useSelector(getSourcePolyChainId)

  const fromPolyChain = getPolyChainById(fromPolyChainId)!
  const toPolyChain = getToPolyChainByFromPolyChain(fromPolyChain)

  useEffect(() => {
    setup(fromPolyChain.ethereumChain)
  }, [fromPolyChain])

  const handleSwitch = () => {
    dispatch(setSourcePolyChainId(toPolyChain.polyChainId))
  }

  return (
    <div className="bridge-container">
      <div className="bridge">
        <div className="title">
          <img className="bridgeImg" src={DOWSIcon} alt="dows" />
          <span>DOWS Bridge</span>
        </div>
        <ChainBridge
          fromPolyChain={fromPolyChain}
          toPolyChain={toPolyChain}
          onSwitch={handleSwitch}
        />
        {
          (providerInitialized && networkReady) ?
            <BridgeMain
              fromPolyChain={fromPolyChain}
              toPolyChain={toPolyChain}
            /> :
            <EmptyBridgeMain />
        }
        {
          !networkReady &&
          <div className="error-hint">
            Please make sure your network is setup to correct!
          </div>
        }
        <p className="copyright">
          Powered By
          <span
            onClick={() => window.open('https://poly.network')}
            className="link"
          >
            Poly.Network
          </span>
        </p>
      </div>
    </div>
  )
}

export default Bridge
