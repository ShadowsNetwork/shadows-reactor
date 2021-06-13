import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { appendTransactionHistory, getAccount } from '@/store/wallet'
import AmountInputModal, { AmountInputModalStatus } from '@/pages/LiquidityProvider/AmountInputModal'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { toByte32, toWei, weiToBigNumber, weiToString } from '@/web3/utils'
import { Button } from 'antd'
import styled from 'styled-components'
import { useDowsSynthesizerData } from '@/hooks/useDowsSynthesizerData'
import { BurnXUSD, MintXUSD, Redeem } from '@/types/TransactionHistory'
import { useTransactionStatusModal } from '@/contexts/TransactionStatusModalContext'
import { useErrorMessage } from '@/hooks'
import { numberWithCommas } from '@/utils'

const DowsInfoContainer = styled.div`
  width: 100%;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .header {
    width: 100%;
    display: flex;
    justify-content: space-around;

    .item {
      font-weight: bold;
      display: flex;
      flex-direction: column;
      align-items: center;

      .title {
        white-space: nowrap;
        color: #63CCA9;
        font-size: 1.2rem;
      }

      .value {
        color: white;
        font-size: 2rem;
      }
    }
  }

  .button-row {
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin: 0rem 0.6rem 0rem 0.6rem;

    .button {
      width: 45%;
      color: white;
      height: 3.757rem;
      border-radius: 1rem;
      font-size: 1.5rem;
      font-weight: bold;
      border-width: 0.2rem;
      border-color: #979797;
    }
  }

  .text-container {
    width: 85%;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    line-height: 0.6;
    margin-bottom: 0.5rem;

    .bold {
      font-size: 1.3rem;
      color: #979797;
    }

    p {
      display: flex;
      justify-content: space-between;
    }
  }

  .redeem-btn {
    margin: 0 auto;
    width: 14rem;
    height: 3.757rem;
    color: white;
    font-weight: bold;
    font-size: 1.5rem;

    border-width: 0.2rem;
    border-radius: 1rem;
    border-color: #979797;
  }
`

const DowsSynthesizer: React.FC = () => {
  const dispatch = useDispatch()

  const account = useSelector(getAccount)

  const { beginTransaction, rejectTransaction, submitTransaction } = useTransactionStatusModal()

  const errorMessageGetter = useErrorMessage()

  const data = useDowsSynthesizerData()
  const { myRatio, targetRatio } = data
  const { totalDows, availableDows, lockedDows } = data
  const { totalFees, redeemableFees, totalRewards, escrowedRewards, redeemableRewards } = data

  const [amountInputModalStatus, setAmountInputModalStatus] = useState<AmountInputModalStatus>({
    visible: false,
    title: '',
    confirmCallback: undefined,
    maxAvailable: '',
    unit: 'DOWS'
  })

  const closeAmountInputModal = () => {
    setAmountInputModalStatus({
      ...amountInputModalStatus,
      visible: false,
      title: '',
      confirmCallback: undefined,
      maxAvailable: '',
      unit: 'DOWS'
    })
  }

  const redeemFees = () => {
    beginTransaction()
    dowsJSConnector.dowsJs.FeePool.claimFees()
      .then(tx => {
        const th: Redeem = new Redeem(tx.hash, numberWithCommas(escrowedRewards, 6), 'xUSD')
        dispatch(appendTransactionHistory(th))
        submitTransaction()
      })
  }

  const redeemRewards = () => {
    beginTransaction()
    dowsJSConnector.dowsJs.RewardEscrow.vest()
      .then(tx => {
        const th: Redeem = new Redeem(tx.hash, numberWithCommas(escrowedRewards, 6))
        dispatch(appendTransactionHistory(th))
        submitTransaction()
      })
  }

  const handleMintXusd = async () => {
    const issueSynth = async (amount: string) => {
      beginTransaction()

      dowsJSConnector.dowsJs.Synthesizer.issueSynths(toWei(amount))
        .then(tx => {
          closeAmountInputModal()

          const transactionHistory: MintXUSD = new MintXUSD(tx.hash, numberWithCommas(amount, 6))
          dispatch(appendTransactionHistory(transactionHistory))
          submitTransaction()
        })
        .catch(e => {
          rejectTransaction(errorMessageGetter(e))
        })
    }

    const [remainingIssuableSynths] = await dowsJSConnector.dowsJs.Synthesizer.remainingIssuableSynths(account)

    setAmountInputModalStatus({
      ...amountInputModalStatus,
      visible: true,
      title: 'Mint xUSD',
      maxAvailable: weiToString(remainingIssuableSynths),
      cancelCallback: closeAmountInputModal,
      confirmCallback: issueSynth,
      unit: 'xUSD'
    })
  }

  const handleBurnXusd = async () => {
    const burnSynths = async amount => {
      beginTransaction()

      dowsJSConnector.dowsJs.Synthesizer.burnSynths(toWei(amount))
        .then(tx => {
          closeAmountInputModal()

          const transactionHistory: BurnXUSD = new BurnXUSD(tx.hash, numberWithCommas(amount, 6))
          dispatch(appendTransactionHistory(transactionHistory))
          submitTransaction()
        })
        .catch(e => {
          rejectTransaction(errorMessageGetter(e))
        })
    }

    const balance = weiToBigNumber(await dowsJSConnector.dowsJs.Synth.balanceOf('xUSD', account!))

    setAmountInputModalStatus({
      ...amountInputModalStatus,
      visible: true,
      title: 'Burn xUSD',
      maxAvailable: balance,
      cancelCallback: closeAmountInputModal,
      confirmCallback: burnSynths,
      unit: 'xUSD'
    })
  }

  return (
    <DowsInfoContainer>
      <div className="header" style={{ marginBottom: '1.5rem' }}>
        <div className="item">
          <div className="title">Current Collateral</div>
          <div className="value">{myRatio}</div>
        </div>
        <div className="item">
          <div className="title">Target Collateral</div>
          <div className="value">{targetRatio}</div>
        </div>
      </div>
      <div className="button-row" style={{ marginBottom: '2.4rem' }}>
        <Button className="button" onClick={handleMintXusd}>
          Mint xUSD
        </Button>
        <Button className="button" onClick={handleBurnXusd}>
          Burn xUSD
        </Button>
      </div>
      <div className="text-container" style={{ marginBottom: '0.8rem' }}>
        <p className="bold">
          <span>Total DOWS</span>
          <span>{numberWithCommas(totalDows, 6)}</span>
        </p>
        <p>
          <span>Available</span>
          <span>{numberWithCommas(availableDows, 6)}</span>
        </p>
        <p>
          <span>Locked</span>
          <span>{numberWithCommas(lockedDows, 6)}</span>
        </p>
      </div>
      <div className="text-container" style={{ marginBottom: '0.8rem' }}>
        <p className="bold">
          <span>Total Fees</span>
          <span>{numberWithCommas(totalFees, 6)}</span>
        </p>
        <p>
          <span>Redeemable</span>
          <span>{numberWithCommas(redeemableFees, 6)}</span>
        </p>
      </div>
      <div className="text-container" style={{ marginBottom: '0.5rem' }}>
        <p className="bold">
          <span>Total Rewards</span>
          <span>{numberWithCommas(totalRewards, 6)}</span>
        </p>
        <p>
          <span>Escrowed</span>
          <span>{numberWithCommas(escrowedRewards, 6)}</span>
        </p>
        <p>
          <span>Redeemable</span>
          <span>{numberWithCommas(redeemableRewards, 6)}</span>
        </p>
      </div>
      <div className="button-row">
        <Button
          className="button"
          onClick={redeemFees}
          disabled={redeemableFees.lte(0)}
          style={{ fontSize: '1.3rem' }}
        >
          Redeem Fees
        </Button>
        <Button
          className="button"
          onClick={redeemRewards}
          disabled={redeemableRewards.lte(0)}
          style={{ fontSize: '1.3rem' }}
        >
          Redeem Rewards
        </Button>
      </div>

      <AmountInputModal {...amountInputModalStatus} />
    </DowsInfoContainer>
  )
}

export default DowsSynthesizer