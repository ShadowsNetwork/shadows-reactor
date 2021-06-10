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
import AmountInputModal, { AmountInputModalStatus } from './AmountInputModal'
import { numberWithCommas } from '@/utils'
import {
  ApproveToken, LockLPToken, Redeem, TransactionHistory, TransactionStatus, UnlockLPToken
} from '@/types/TransactionHistory'
import { TransactionResponse } from '@/ShadowsJs/contracts/type'
import { useErrorMessage, useInitializeProvider, useSetupNetwork } from '@/hooks'
import RedeemModal, { RedeemModalStatus } from '@/pages/LiquidityProvider/RedeemModal'
import { useStakingData } from '@/hooks/useStakingData'
import { PoolConfig } from '@/types/LiquidityProvider'
import { ConfigType } from '../../../config'
import { useTransactionStatusModal } from '@/contexts/TransactionStatusModalContext'

const config = process.env.CONTRACT_CONFIG as unknown as ConfigType

const EmptyPool: React.FC<PoolConfig> = ({ poolName, leftCurrency, rightCurrency, poolType }) => (
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
          <div className="title">{poolType == 'pair' ? 'Total LP Locked' : 'Total Locked'}</div>
          <div className="value">-</div>
          <div className="additional">-</div>
        </div>
        <div className="item">
          <div className="title">APY</div>
          <div className="value">-</div>
        </div>
        <div className="item">
          <div className="title">{poolType == 'pair' ? 'Your LP Locked' : 'Your Locked'}</div>
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
  poolType,
  tokenName,
  lpMultiplier,
  leftCurrency,
  rightCurrency,
  lpTokenContractAddress,
  farmContractAddress
}) => {
  const unit = (leftCurrency ? `${leftCurrency.name}/` : '') + rightCurrency.name

  const [amountInputModalStatus, setAmountInputModalStatus] = useState<AmountInputModalStatus>({
    visible: false,
    title: '',
    confirmCallback: undefined,
    maxAvailable: '',
    unit
  })

  const [redeemModalStatus, setRedeemModalStatus] = useState<RedeemModalStatus>({
    visible: false,
    amount: '',
    onConfirm: undefined,
    onClose: undefined
  })

  const account = useSelector(getAccount)

  const dispatch = useDispatch()

  const getErrorMessage = useErrorMessage()

  const { beginTransaction, submitTransaction, rejectTransaction } = useTransactionStatusModal()

  const {
    totalLockedLP,
    totalLockedLPInUSD,
    APY,
    userLpBalance,
    userLockedLp,
    userLockedLpInUSD,
    dowsEarned,
    allowanceEnough
  } = useStakingData({
    lpTokenContractAddress, farmContractAddress, poolNumber, poolType, lpMultiplier
  })

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

  const approve = async () => {
    try {
      beginTransaction()
      const approveResult: TransactionResponse = await dowsJSConnector.dowsJs.LpERC20Token.approve(lpTokenContractAddress, farmContractAddress)
      submitTransaction()

      const transactionHistory = new ApproveToken(approveResult.hash, tokenName, process.env.BLOCK_EXPLORER_URL, TransactionStatus.Submitted)
      dispatch(appendTransactionHistory(transactionHistory))
    } catch (e) {
      rejectTransaction(getErrorMessage(e))
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
      beginTransaction()
      const depositResult = await dowsJSConnector.dowsJs.Farm.deposit(farmContractAddress, poolNumber, amountInWei)
      closeAmountInputModal()

      submitTransaction()

      const transactionHistory: TransactionHistory = new LockLPToken(depositResult.hash, amount, TransactionStatus.Submitted)
      dispatch(appendTransactionHistory(transactionHistory))

    } catch (e) {
      rejectTransaction(getErrorMessage(e))
    }
  }

  const unlock = async (amount: string) => {
    try {
      const amountInWei = toWei(amount)
      beginTransaction()

      const withdrawResult = await dowsJSConnector.dowsJs.Farm.withdraw(farmContractAddress, poolNumber, amountInWei)
      closeAmountInputModal()
      submitTransaction()

      const transactionHistory: TransactionHistory = new UnlockLPToken(withdrawResult.hash, amount, TransactionStatus.Submitted)
      dispatch(appendTransactionHistory(transactionHistory))
    } catch (e) {
      rejectTransaction(getErrorMessage(e))
    }
  }

  const redeem = async () => {
    try {
      beginTransaction()

      const withdrawResult = await dowsJSConnector.dowsJs.Farm.withdraw(farmContractAddress, poolNumber, 0)
      submitTransaction()
      closeRedeemModal()

      const transactionHistory: TransactionHistory = new Redeem(withdrawResult.hash, dowsEarned, TransactionStatus.Submitted)
      dispatch(appendTransactionHistory(transactionHistory))

      withdrawResult.wait()
        .then(() => {
          transactionHistory.complete()
          dispatch(updateTransactionHistoryStatus(transactionHistory))
        })
        .catch(() => {
          transactionHistory.fail()
          dispatch(updateTransactionHistoryStatus(transactionHistory))
        })
    } catch (e) {
      rejectTransaction(getErrorMessage(e))
    }
  }

  return (
    <div className="pool">
      <div className="pool-name">
        <span>{poolName}</span>
      </div>
      <div className="pool-main">
        <div className="info-container-title">
          {unit}
        </div>
        <img src={rightCurrency.icon} alt="" />
        <img className="infoContent-dows" src={leftCurrency?.icon} alt="" />
        <div className="info-container">
          <div className="item">
            <div className="title">{poolType == 'pair' ? 'Total LP Locked' : 'Total Locked'}</div>
            <div className="value">{numberWithCommas(totalLockedLP)}</div>
            <div className="additional">${numberWithCommas(totalLockedLPInUSD)}</div>
          </div>
          <div className="item">
            <div className="title">APY</div>
            <div className="value">{numberWithCommas(APY)}%</div>
          </div>
          <div className="item">
            <div className="title">{poolType == 'pair' ? 'Your LP Locked' : 'Your Locked'}</div>
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
            allowanceEnough ?
              <>
                <Button
                  className="lock"
                  onClick={() => {
                    setAmountInputModalStatus({
                      ...amountInputModalStatus,
                      maxAvailable: userLpBalance,
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
              </> :
              <Button onClick={approve} className="approve">
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
      <AmountInputModal {...amountInputModalStatus} />
      <RedeemModal {...redeemModalStatus} />
    </div>
  )
}

const LiquidityProvider: React.FC = () => {
  const chainId = parseInt(process.env.CHAIN_ID!, 16)
  const RPCUrl = process.env.RPC_URL!

  const providerInitialized = useInitializeProvider(chainId, RPCUrl)
  const networkReady = useSetupNetwork(providerInitialized, {
    blockExplorerUrls: [process.env.BLOCK_EXPLORER_URL!],
    chainName: process.env.NETWORK_NAME!,
    chainId: process.env.CHAIN_ID!,
    rpcUrls: [RPCUrl]
  })

  return (
    <div className="liquidity-provider">
      {
        config.liquidityProvider.supportedPools.map((pool, index) =>
          providerInitialized && networkReady
            ? <Pool {...pool} key={index} />
            : <EmptyPool {...pool} key={index} />
        )
      }
    </div>
  )
}

export default LiquidityProvider
