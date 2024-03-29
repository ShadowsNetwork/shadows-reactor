import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { appendTransactionHistory, updateTransactionHistoryStatus } from '@/store/wallet'
import './index.less'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { toWei } from '@/web3/utils'
import BigNumber from 'bignumber.js'
import AmountInputModal, { AmountInputModalStatus } from './AmountInputModal'
import { numberWithCommas } from '@/utils'
import {
  ApproveToken, LockLPToken, RedeemDOWS, TransactionHistory, TransactionStatus, UnlockLPToken
} from '@/types/TransactionHistory'
import { TransactionResponse } from '@/ShadowsJs/contracts/type'
import { useErrorMessage } from '@/hooks/useErrorMessage'
import RedeemModal, { RedeemModalStatus } from '@/pages/Staking/RedeemModal'
import { useStakingData } from '@/hooks/data/useStakingData'
import { PoolConfig } from '@/types/LiquidityProvider'
import { useTransactionStatusModal } from '@/contexts/TransactionStatusModalContext'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'
import { useRefreshController } from '@/contexts/RefreshControllerContext'
import { useDowsSynthesizerData } from '@/hooks/data/useDowsSynthesizerData'
import { useWeb3React } from '@web3-react/core'

import config from '@/config'
import {
  PoolContainer, PoolContentContainer, PoolTitle, StakingPageContainer
} from '@/pages/Staking/index.style'

const EmptyStakingPool: React.FC<PoolConfig> = ({
  poolName, leftCurrency, rightCurrency, poolType
}) => {
  return (
    <PoolContainer>
      <PoolTitle>
        <span>{poolName}</span>
      </PoolTitle>
      <PoolContentContainer>
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
            <div className="title">APR</div>
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
      </PoolContentContainer>
    </PoolContainer>
  )
}

const StakingPool: React.FC<PoolConfig> = ({
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

  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const getErrorMessage = useErrorMessage()
  const { beginTransaction, submitTransaction, rejectTransaction } = useTransactionStatusModal()
  const { forceRefresh } = useRefreshController()
  const { availableDows } = useDowsSynthesizerData()
  const { networkReady } = useWeb3EnvContext()

  const {
    totalLockedLP,
    totalLockedLPInUSD,
    apy,
    userLpBalance,
    userLockedLp,
    userLockedLpInUSD,
    dowsEarned,
    allowanceEnough
  } = useStakingData({
    lpTokenContractAddress, farmContractAddress, poolNumber, lpMultiplier
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

      approveResult.wait()
        .then(forceRefresh)
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

      depositResult.wait()
        .then(forceRefresh)
    } catch (e) {
      rejectTransaction(getErrorMessage(e))
    }
  }

  const prepareToLock = () => {
    setAmountInputModalStatus({
      ...amountInputModalStatus,
      maxAvailable: tokenName === 'DOWS' ? availableDows! : userLpBalance!,
      visible: true,
      title: 'Stake Liquidity',
      cancelCallback: closeAmountInputModal,
      confirmCallback: lock
    })
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

      withdrawResult.wait()
        .then(forceRefresh)
    } catch (e) {
      rejectTransaction(getErrorMessage(e))
    }
  }

  const prepareToUnlock = () => {
    setAmountInputModalStatus({
      ...amountInputModalStatus,
      maxAvailable: userLockedLp!,
      visible: true,
      title: 'Unstake Liquidity',
      cancelCallback: closeAmountInputModal,
      confirmCallback: unlock
    })
  }

  const redeem = async () => {
    try {
      beginTransaction()

      const withdrawResult = await dowsJSConnector.dowsJs.Farm.withdraw(farmContractAddress, poolNumber, 0)
      submitTransaction()
      closeRedeemModal()

      const transactionHistory: TransactionHistory = new RedeemDOWS(withdrawResult.hash, dowsEarned!, TransactionStatus.Submitted)
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

  const prepareToRedeem = () => {
    setRedeemModalStatus({
      ...redeemModalStatus,
      amount: dowsEarned!,
      visible: true,
      onConfirm: redeem,
      onClose: closeRedeemModal
    })
  }

  return (
    <PoolContainer>
      <PoolTitle>
        <span>{poolName}</span>
      </PoolTitle>
      <PoolContentContainer>
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
            <div className="title">APR</div>
            <div className="value">{numberWithCommas(apy)}%</div>
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
            allowanceEnough ? (
              <>
                <Button className="lock" onClick={prepareToLock} disabled={!networkReady}>
                  <PlusOutlined style={{ fontSize: '1.1rem', color: '#FFFEFE' }} />
                </Button>
                <Button className="unlock" onClick={prepareToUnlock} disabled={!networkReady}>
                  Unlock
                </Button>
              </>
            ) : (
              <Button onClick={approve} className="approve" disabled={!networkReady}>
                Approve
              </Button>
            )
          }
          <Button className="redeem" onClick={prepareToRedeem} disabled={!networkReady}>
            Redeem
          </Button>
        </div>
      </PoolContentContainer>
      <AmountInputModal {...amountInputModalStatus} />
      <RedeemModal {...redeemModalStatus} />
    </PoolContainer>
  )
}

const Staking: React.FC = () => {
  const { providerReady } = useWeb3EnvContext()

  return (
    <StakingPageContainer>
      {
        config.liquidityProvider.supportedPools.map((pool, index) =>
          providerReady
            ? <StakingPool {...pool} key={index} />
            : <EmptyStakingPool {...pool} key={index} />
        )
      }
    </StakingPageContainer>
  )
}

export default Staking
