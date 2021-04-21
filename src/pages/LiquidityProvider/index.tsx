import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAccount, updateTransactionHistoryStatus } from '@/store/wallet'
import './index.less'
import { Button, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { fromWei, toWei } from '@/web3/utils'
import BigNumber from 'bignumber.js'
import uniswap from '@/img/liquidityProvider/uniswap.png'
import eth from '@/img/liquidityProvider/eth.png'
import LpAmountInputModal, { LpAmountInputModalStatus } from './LpAmountInputModal'
import useDowsPriceQuery from '@/queries/useDowsPriceQuery'
import { numberWithCommas } from '@/utils'
import dowsIcon from '@/img/dows-info/dows.png'
import TransactionStatusModal, { TransactionStatusModalProps } from '@/components/TransactionStatusModal'
import {
  beginTransaction,
  rejectTransaction,
  submitTransaction
} from '@/components/TransactionStatusModal/event'
import {
  LockLPToken, RedeemDows,
  TransactionHistory,
  UnlockLPToken
} from '@/types/TransactionHistory'
import { TransactionResponse } from '@/ShadowsJs/contracts/type'
import { notifyTransactionFailed, notifyTransactionSuccess } from '@/utils/TransactionNotifycation'
import { appendTransactionHistory } from '@/store/wallet'
import { useErrorMessage } from '@/hooks'

async function getCurrentAPR() {
  const lp_to_dows = new BigNumber('33.22443529339985')

  const totalSupply = new BigNumber(fromWei(await dowsJSConnector.dowsJs.LpERC20Token.totalSupply()))

  const totalDows = lp_to_dows.multipliedBy(totalSupply)

  return `${new BigNumber('4.5e6').dividedBy(totalDows)
    .multipliedBy('1e2')
    .toFixed(2)} %`
}

type RedeemModalStatus = {
  visible: boolean
  amount: string
  onConfirm?: () => void
  onClose?: () => void
}

const RedeemModal: React.FC<RedeemModalStatus> = ({
  amount,
  visible,
  onClose,
  onConfirm
}) => {
  return (
    <Modal
      title="Redeem Reward"
      visible={visible}
      okText="Confirm"
      onOk={onConfirm}
      onCancel={onClose}
      footer=""
    >
      <div className="redeemContent">
        <img src={dowsIcon} className="redeem-modal-dows-icon" alt="" />
        <span className="redeem-modal-text">
          {`${amount} DOWS Available`}
        </span>
      </div>
      <div className="redeemFoot">
        <Button key="back" className="onClose" onClick={onClose}>Cancel</Button>
        <Button key="redeem" className="redeem" onClick={onConfirm}>Redeem</Button>
      </div>
    </Modal>
  )
}

const LiquidityProvider: React.FC = () => {
  const [refreshFlag, setRefreshFlag] = useState(0)
  const account = useSelector(getAccount)
  const dowsPrice = new BigNumber((useDowsPriceQuery().data as string))
  const dispatch = useDispatch()
  const getErrorMessage = useErrorMessage()

  const [amountInputModalStatus, setAmountInputModalStatus] = useState<LpAmountInputModalStatus>({
    visible: false,
    title: '',
    confirmCallback: undefined,
    maxAvailable: ''
  })

  const [redeemModalStatus, setRedeemModalStatus] = useState<RedeemModalStatus>({
    visible: false,
    amount: '',
    onConfirm: undefined,
    onClose: undefined
  })

  const [transactionStatusModalProps, setTransactionStatusModalProps] = useState<TransactionStatusModalProps>({
    onClose: undefined,
    status: undefined,
    visible: false
  })

  const [lpBalance, setLpBalance] = useState('0')
  const [lpBalanceInUSD, setLpBalanceInUSD] = useState('0')
  const [currentAPR, setCurrentAPR] = useState('0')
  const [userLockedLp, setUserLockedLp] = useState('0')
  const [userLockedLpInUSD, setUserLockedLpInUSD] = useState('0')
  const [dowsEarned, setDowsEarned] = useState('0')

  const fetchData = useCallback(async () => {
    if (!account) {
      setLpBalance('0')
      setLpBalanceInUSD('0')
      setCurrentAPR('0')
      setUserLockedLpInUSD('0')
      setUserLockedLp('0')
      setDowsEarned('0')
      return
    }
    const [balance, deposited, pending, currentAPR] = await Promise.all([
      dowsJSConnector.dowsJs.LpERC20Token.balanceOf(account),
      dowsJSConnector.dowsJs.Farm.deposited(0, account),
      dowsJSConnector.dowsJs.Farm.pending(0, account),
      getCurrentAPR()
    ])
    setLpBalance(fromWei(balance))
    setLpBalanceInUSD(new BigNumber(lpBalance).multipliedBy(dowsPrice)
      .toFixed(2))

    setUserLockedLp(fromWei(deposited))
    setUserLockedLpInUSD(new BigNumber(userLockedLp).multipliedBy(dowsPrice)
      .toFixed(2))

    setDowsEarned(new BigNumber(fromWei(pending)).toFixed(2))
    setCurrentAPR(currentAPR)
  }, [account, dowsPrice, refreshFlag])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const closeAmountInputModal = () => {
    setAmountInputModalStatus({
      ...amountInputModalStatus,
      visible: false
    })
  }

  const closeRedeemModal = () => {
    setRedeemModalStatus({
      ...redeemModalStatus,
      visible: false
    })
  }

  const closeTransactionStatusModal = () => {
    setTransactionStatusModalProps({
      ...transactionStatusModalProps,
      visible: false
    })
  }

  const lock = async (amount: string) => {
    const lpBalance = await dowsJSConnector.dowsJs.LpERC20Token.balanceOf(account)
    const amountInWei = toWei(amount)

    if (new BigNumber(amountInWei).gt(new BigNumber(lpBalance.toString()))) {
      message.error('Insufficient balance.')
      return
    }

    const { contractAddress } = dowsJSConnector.dowsJs.Farm

    try {
      beginTransaction(transactionStatusModalProps, setTransactionStatusModalProps)
      const approveResult: TransactionResponse = await dowsJSConnector.dowsJs.LpERC20Token.approve(contractAddress, amountInWei)
      submitTransaction(transactionStatusModalProps, setTransactionStatusModalProps)

      await approveResult.wait()

      beginTransaction(transactionStatusModalProps, setTransactionStatusModalProps)
      const depositResult = await dowsJSConnector.dowsJs.Farm.deposit(0, amountInWei)
      closeAmountInputModal()
      submitTransaction(transactionStatusModalProps, setTransactionStatusModalProps)

      const transactionHistory: TransactionHistory = new LockLPToken(depositResult.hash, amount)
      dispatch(appendTransactionHistory(transactionHistory))

      depositResult.wait()
        .then(() => {
          transactionHistory.complete()
          dispatch(updateTransactionHistoryStatus(transactionHistory))
          notifyTransactionSuccess(transactionHistory)
          setRefreshFlag(refreshFlag + 1)
        })
        .catch(() => {
          transactionHistory.fail()
          dispatch(updateTransactionHistoryStatus(transactionHistory))
          notifyTransactionFailed(transactionHistory)
        })
    } catch (e) {
      rejectTransaction(transactionStatusModalProps,
        setTransactionStatusModalProps,
        getErrorMessage(e)
      )
    }
  }

  const unlock = async (amount: string) => {
    try {
      const amountInWei = toWei(amount)
      beginTransaction(transactionStatusModalProps, setTransactionStatusModalProps)

      const withdrawResult = await dowsJSConnector.dowsJs.Farm.withdraw(0, amountInWei)
      closeAmountInputModal()
      submitTransaction(transactionStatusModalProps, setTransactionStatusModalProps)

      const transactionHistory: TransactionHistory = new UnlockLPToken(withdrawResult.hash, amount)
      dispatch(appendTransactionHistory(transactionHistory))

      withdrawResult.wait()
        .then(() => {
          transactionHistory.complete()
          dispatch(updateTransactionHistoryStatus(transactionHistory))
          notifyTransactionSuccess(transactionHistory)
          setRefreshFlag(refreshFlag + 1)
        })
        .catch(() => {
          transactionHistory.fail()
          dispatch(updateTransactionHistoryStatus(transactionHistory))
          notifyTransactionFailed(transactionHistory)
        })
    } catch (e) {
      rejectTransaction(
        transactionStatusModalProps,
        setTransactionStatusModalProps,
        getErrorMessage(e)
      )
    }
  }

  const redeem = async () => {
    try {
      beginTransaction(transactionStatusModalProps, setTransactionStatusModalProps)

      const withdrawResult = await dowsJSConnector.dowsJs.Farm.withdraw(0, 0)
      submitTransaction(transactionStatusModalProps, setTransactionStatusModalProps)
      closeRedeemModal()

      const transactionHistory: TransactionHistory = new RedeemDows(withdrawResult.hash, dowsEarned)
      dispatch(appendTransactionHistory(transactionHistory))

      withdrawResult.wait()
        .then(() => {
          transactionHistory.complete()
          dispatch(updateTransactionHistoryStatus(transactionHistory))
          notifyTransactionSuccess(transactionHistory)
          setRefreshFlag(refreshFlag + 1)
        })
        .catch(() => {
          transactionHistory.fail()
          dispatch(updateTransactionHistoryStatus(transactionHistory))
          notifyTransactionFailed(transactionHistory)
        })
    } catch (e) {
      rejectTransaction(
        transactionStatusModalProps,
        setTransactionStatusModalProps,
        getErrorMessage(e)
      )
    }
  }

  return (
    <div className="liquidity">
      <div className="uniswap">
        <img src={uniswap} alt="" />
        <span>Uniswap</span>
      </div>
      <div className="info">
        <div className="info-container-title">DOWS/ETH</div>
        <img src={eth} alt="" />
        <div className="info-container">
          <div className="item">
            <div className="title">LP Tokens to Lock</div>
            <div className="value">{numberWithCommas(lpBalance)}</div>
            <div className="additional">${numberWithCommas(lpBalanceInUSD)}</div>
          </div>
          <div className="item">
            <div className="title">Current APR</div>
            <div className="value">{currentAPR}</div>
          </div>
          <div className="item">
            <div className="title">Your LP Locked</div>
            <div className="value">{numberWithCommas(userLockedLp)}</div>
            <div className="additional">${numberWithCommas(userLockedLpInUSD)}</div>
          </div>
          <div className="item">
            <div className="title">DOWS Earned</div>
            <div className="value">{dowsEarned}</div>
          </div>
        </div>
        <div className="button-container">
          <Button onClick={() => {
            setAmountInputModalStatus({
              ...amountInputModalStatus,
              maxAvailable: lpBalance,
              visible: true,
              title: 'Stake Liquidity',
              cancelCallback: closeAmountInputModal,
              confirmCallback: lock
            })
          }}>
            <PlusOutlined className="addAmount" style={{ fontSize: '1.1rem' }} />
          </Button>
          <Button onClick={() => {
            setAmountInputModalStatus({
              ...amountInputModalStatus,
              maxAvailable: userLockedLp,
              visible: true,
              title: 'Unstake Liquidity',
              cancelCallback: closeAmountInputModal,
              confirmCallback: unlock
            })
          }}>
            Unlock
          </Button>
          <Button onClick={() => {
            setRedeemModalStatus({
              ...redeemModalStatus,
              amount: dowsEarned,
              visible: true,
              onConfirm: redeem,
              onClose: closeRedeemModal
            })
          }}>
            Redeem
          </Button>
        </div>
      </div>
      <LpAmountInputModal {...amountInputModalStatus} />
      <RedeemModal {...redeemModalStatus} />
      <TransactionStatusModal
        {...transactionStatusModalProps}
        onClose={closeTransactionStatusModal}
      />
    </div>
  )
}

export default LiquidityProvider
