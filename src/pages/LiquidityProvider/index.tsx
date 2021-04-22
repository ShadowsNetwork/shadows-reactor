import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  appendTransactionHistory, getAccount, updateTransactionHistoryStatus
} from '@/store/wallet'
import './index.less'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { toWei } from '@/web3/utils'
import BigNumber from 'bignumber.js'
import LpAmountInputModal, { LpAmountInputModalStatus } from './LpAmountInputModal'
import { numberWithCommas } from '@/utils'
import TransactionStatusModal, { TransactionStatusModalProps } from '@/components/TransactionStatusModal'
import {
  beginTransaction, rejectTransaction, submitTransaction
} from '@/components/TransactionStatusModal/event'
import {
  LockLPToken, RedeemDows, TransactionHistory, TransactionStatus, UnlockLPToken
} from '@/types/TransactionHistory'
import { TransactionResponse } from '@/ShadowsJs/contracts/type'
import { notifyTransactionFailed, notifyTransactionSuccess } from '@/utils/TransactionNotifycation'
import { useErrorMessage, useInitializeProvider } from '@/hooks'
import RedeemModal, { RedeemModalStatus } from '@/pages/LiquidityProvider/RedeemModal'
import { usePoolData } from '@/pages/LiquidityProvider/usePoolData'
import { PoolConfig } from '@/types/LiquidityProvider'

import config from '../../../config'

const EmptyPool: React.FC<PoolConfig> = ({ poolName, leftCurrency, rightCurrency }) => (
  <div className="pool">
    <div className="pool-name">
      <span>{poolName}</span>
    </div>
    <div className="pool-main">
      <div className="info-container-title">
        {leftCurrency && `${leftCurrency.name}/`}{rightCurrency.name}
      </div>
      <img src={rightCurrency.icon} alt="" />
      <img className="infoContent-dows" src={leftCurrency?.icon} alt="" />
      <div className="info-container">
        <div className="item">
          <div className="title">Total LP Locked</div>
          <div className="value">-</div>
          <div className="additional">-</div>
        </div>
        <div className="item">
          <div className="title">APY</div>
          <div className="value">-</div>
        </div>
        <div className="item">
          <div className="title">Your LP Locked</div>
          <div className="value">-</div>
          <div className="additional">-</div>
        </div>
        <div className="item">
          <div className="title">DOWS Earned</div>
          <div className="value">-</div>
        </div>
      </div>
      <div className="button-container">

        <Button className="lock">
          <PlusOutlined style={{ fontSize: '1.1rem', color: '#FFFEFE' }} />
        </Button>
        <Button className="unlock">
          Unlock
        </Button>
        <Button className="redeem">
          Redeem
        </Button>
      </div>
    </div>
  </div>)

const Pool: React.FC<PoolConfig> = ({
  poolNumber,
  poolName,
  leftCurrency,
  rightCurrency,
  lpTokenContractAddress,
  farmContractAddress
}) => {
  const [refreshFlag, setRefreshFlag] = useState(0)

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

  const account = useSelector(getAccount)

  const dispatch = useDispatch()

  const getErrorMessage = useErrorMessage()

  const {
    lpBalance,
    lpBalanceInUSD,
    currentAPR,
    userLockedLp,
    userLockedLpInUSD,
    dowsEarned,
    allowanceEnough
  } = usePoolData({ lpTokenContractAddress, farmContractAddress, poolNumber, refreshFlag })

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

  const forceRefreshData = () => {
    setRefreshFlag(new Date().getMilliseconds())
  }

  const approve = async () => {
    try {
      beginTransaction(transactionStatusModalProps, setTransactionStatusModalProps)
      const approveResult: TransactionResponse = await dowsJSConnector.dowsJs.LpERC20Token.approve(lpTokenContractAddress, farmContractAddress)
      submitTransaction(transactionStatusModalProps, setTransactionStatusModalProps)

      approveResult.wait()
        .then(() => {
          forceRefreshData()
        })
        .catch(() => {
          rejectTransaction(transactionStatusModalProps,
            setTransactionStatusModalProps,
            'Approve failed! Please retry.'
          )
        })
    } catch (e) {
      rejectTransaction(transactionStatusModalProps,
        setTransactionStatusModalProps,
        getErrorMessage(e)
      )
    }
  }

  const lock = async (amount: string) => {
    const lpBalance = await dowsJSConnector.dowsJs.LpERC20Token.balanceOf(lpTokenContractAddress, account!)
    const amountInWei = toWei(amount)

    if (new BigNumber(amountInWei).gt(new BigNumber(lpBalance.toString()))) {
      message.error('Insufficient balance.')
      return
    }

    try {
      beginTransaction(transactionStatusModalProps, setTransactionStatusModalProps)
      const depositResult = await dowsJSConnector.dowsJs.Farm.deposit(farmContractAddress, poolNumber, amountInWei)
      closeAmountInputModal()

      submitTransaction(transactionStatusModalProps, setTransactionStatusModalProps)

      const transactionHistory: TransactionHistory = new LockLPToken(depositResult.hash, amount, TransactionStatus.Submitted)
      dispatch(appendTransactionHistory(transactionHistory))

      depositResult.wait()
        .then(() => {
          transactionHistory.complete()
          dispatch(updateTransactionHistoryStatus(transactionHistory))
          notifyTransactionSuccess(transactionHistory)
          forceRefreshData()
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

      const withdrawResult = await dowsJSConnector.dowsJs.Farm.withdraw(farmContractAddress, poolNumber, amountInWei)
      closeAmountInputModal()
      submitTransaction(transactionStatusModalProps, setTransactionStatusModalProps)

      const transactionHistory: TransactionHistory = new UnlockLPToken(withdrawResult.hash, amount, TransactionStatus.Submitted)
      dispatch(appendTransactionHistory(transactionHistory))

      withdrawResult.wait()
        .then(() => {
          transactionHistory.complete()
          dispatch(updateTransactionHistoryStatus(transactionHistory))
          notifyTransactionSuccess(transactionHistory)
          forceRefreshData()
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

      const withdrawResult = await dowsJSConnector.dowsJs.Farm.withdraw(farmContractAddress, poolNumber, 0)
      submitTransaction(transactionStatusModalProps, setTransactionStatusModalProps)
      closeRedeemModal()

      const transactionHistory: TransactionHistory = new RedeemDows(withdrawResult.hash, dowsEarned, TransactionStatus.Submitted)
      dispatch(appendTransactionHistory(transactionHistory))

      withdrawResult.wait()
        .then(() => {
          transactionHistory.complete()
          dispatch(updateTransactionHistoryStatus(transactionHistory))
          notifyTransactionSuccess(transactionHistory)
          forceRefreshData()
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
    <div className="pool">
      <div className="pool-name">
        <span>{poolName}</span>
      </div>
      <div className="pool-main">
        <div className="info-container-title">
          {leftCurrency && `${leftCurrency.name}/`}{rightCurrency.name}
        </div>
        <img src={rightCurrency.icon} alt="" />
        <img className="infoContent-dows" src={leftCurrency?.icon} alt="" />
        <div className="info-container">
          <div className="item">
            <div className="title">Total LP Locked</div>
            <div className="value">{numberWithCommas(lpBalance)}</div>
            <div className="additional">${numberWithCommas(lpBalanceInUSD)}</div>
          </div>
          <div className="item">
            <div className="title">APY</div>
            <div className="value">{numberWithCommas(currentAPR)}</div>
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
          {
            allowanceEnough
              ? <>
                <Button
                  className="lock"
                  onClick={() => {
                    setAmountInputModalStatus({
                      ...amountInputModalStatus,
                      maxAvailable: lpBalance,
                      visible: true,
                      title: 'Stake Liquidity',
                      cancelCallback: closeAmountInputModal,
                      confirmCallback: lock
                    })
                  }}
                >
                  <PlusOutlined style={{ fontSize: '1.1rem', color: '#FFFEFE' }} />
                </Button>
                <Button
                  className="unlock"
                  onClick={() => {
                    setAmountInputModalStatus({
                      ...amountInputModalStatus,
                      maxAvailable: userLockedLp,
                      visible: true,
                      title: 'Unstake Liquidity',
                      cancelCallback: closeAmountInputModal,
                      confirmCallback: unlock
                    })
                  }}
                >
                  Unlock
                </Button>
              </>
              : <Button onClick={approve} className="approve">
                Approve
              </Button>
          }
          <Button
            className="redeem"
            onClick={() => {
              setRedeemModalStatus({
                ...redeemModalStatus,
                amount: dowsEarned,
                visible: true,
                onConfirm: redeem,
                onClose: closeRedeemModal
              })
            }}
          >
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

const LiquidityProvider: React.FC = () => {
  const providerInitialized = useInitializeProvider()

  return (
    <div className="liquidity-provider">
      {
        config.liquidityProvider.supportedPools.map((pool, index) =>
          providerInitialized
            ? <Pool {...pool} key={index} />
            : <EmptyPool {...pool} key={index} />
        )
      }
    </div>
  )
}

export default LiquidityProvider
