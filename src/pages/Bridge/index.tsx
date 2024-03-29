import LimitableNumberInput from '@/components/LimitableNumberInput'
import React, { useMemo, useState } from 'react'

import { useErrorMessage } from '@/hooks/useErrorMessage'
import { Button } from 'antd'
import BigNumber from 'bignumber.js'
import useBridgeData from '@/hooks/data/useBridgeData'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { toWei } from '@/web3/utils'
import { useDispatch, useSelector } from 'react-redux'
import { appendTransactionHistory, updateTransactionHistoryStatus } from '@/store/wallet'
import { getSourcePolyChainId, setSourcePolyChainId } from '@/store/bridge'
import DOWSIcon from '@/img/dows-info/dows.png'
import switchImg from '@/img/bridge/switch.png'
import { ApproveToken, BridgeDows, TransactionStatus } from '@/types/TransactionHistory'
import { PolyChain } from '@/types/PolyChain'
import { getPolyChainById, getToPolyChainByFromPolyChain } from '@/utils/bridgeUtils'
import { useTransactionStatusModal } from '@/contexts/TransactionStatusModalContext'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'
import { useRefreshController } from '@/contexts/RefreshControllerContext'
import { useWeb3React } from '@web3-react/core'
import { numberWithCommas } from '@/utils'
import {
  BridgeContainer, BridgeFormContainer, DirectionSwitcherContainer
} from '@/pages/Bridge/index.style'

type BridgeProps = {
  fromPolyChain: PolyChain
  toPolyChain: PolyChain
}

type ChainBridgeProps = {
  fromPolyChain: PolyChain
  toPolyChain: PolyChain
  onSwitch: () => void
}

const DirectionSwitcher: React.FC<ChainBridgeProps> = ({
  fromPolyChain,
  toPolyChain,
  onSwitch
}) => (
  <DirectionSwitcherContainer>
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
  </DirectionSwitcherContainer>
)

const BridgeForm: React.FC<BridgeProps> = ({
  fromPolyChain,
  toPolyChain
}) => {
  const { dowsTokenAddress, lockContractAddress } = fromPolyChain

  const dispatch = useDispatch()
  const getErrorMessage = useErrorMessage()
  const { account } = useWeb3React()
  const [amount, setAmount] = useState<string>('')

  const { data } = useBridgeData({ fromPolyChain, toPolyChain })
  const { allowance, balance, fee } = data ?? {}

  const { forceRefresh } = useRefreshController()

  const { beginTransaction, rejectTransaction, submitTransaction } = useTransactionStatusModal()

  const allowanceEnough = useMemo<boolean>(() => {
    return !!allowance && new BigNumber(amount).lt(new BigNumber(allowance))
  }, [allowance, amount])

  const isAmountLegal = useMemo<boolean>(() => {
    return !amount || (!!fee && new BigNumber(amount).gt(new BigNumber(fee)))
  }, [amount, fee])

  const setAmountToMax = () => {
    balance && setAmount(balance.toString())
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
          forceRefresh()
        })
    } catch (e) {
      rejectTransaction(getErrorMessage(e))
    }
    // rejectTransaction(transactionStatusModalProps,
    //   setTransactionStatusModalProps,
    //   'under maintenance.....'
    // )
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
          forceRefresh()
        })
    } catch (e) {
      rejectTransaction(getErrorMessage(e))
    }
    // rejectTransaction(transactionStatusModalProps,
    //   setTransactionStatusModalProps,
    //   'under maintenance.....'
    // )
  }

  return (
    <BridgeFormContainer>
      <div className="balance-row">
        <div className="available">
          {balance ? numberWithCommas(balance) : '-'} DOWS Available
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
            allowanceEnough ?
              <Button onClick={convert} disabled={!isAmountLegal}>
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
          !isAmountLegal &&
          <div className="error-hint">
            The input amount must be greater than the fee.
          </div>
        }
      </div>
    </BridgeFormContainer>
  )
}

const Bridge: React.FC = () => {
  const { providerReady, networkReady } = useWeb3EnvContext()

  const dispatch = useDispatch()
  const fromPolyChainId = useSelector(getSourcePolyChainId)

  const fromPolyChain = getPolyChainById(fromPolyChainId)!
  const toPolyChain = getToPolyChainByFromPolyChain(fromPolyChain)

  const handleSwitch = () => {
    dispatch(setSourcePolyChainId(toPolyChain.polyChainId))
  }

  const errorMessage = useMemo(() => {
    if (networkReady === undefined) {
      return 'Please connect to a wallet first'
    }

    if (!networkReady) {
      return 'Please make sure your network is setup to correct!'
    }

    return undefined
  }, [networkReady, providerReady])

  return (
    <BridgeContainer>
      <div className="bridge">
        <div className="title">
          <img className="bridgeImg" src={DOWSIcon} alt="dows" />
          <span>DOWS Bridge</span>
        </div>
        <DirectionSwitcher
          fromPolyChain={fromPolyChain}
          toPolyChain={toPolyChain}
          onSwitch={handleSwitch}
        />
        <BridgeForm
          fromPolyChain={fromPolyChain}
          toPolyChain={toPolyChain}
        />
        {
          <div className="error-hint">
            {errorMessage}
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
    </BridgeContainer>
  )
}

export default Bridge
