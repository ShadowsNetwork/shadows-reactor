import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  appendTransactionHistory, getAccount, updateTransactionHistoryStatus
} from '@/store/wallet'
import AmountInputModal, { AmountInputModalStatus } from '@/pages/LiquidityProvider/AmountInputModal'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { toWei, weiToBigNumber, weiToString } from '@/web3/utils'
import { Button } from 'antd'
import styled from 'styled-components'
import { useDowsSynthesizerData } from '@/hooks/useDowsSynthesizerData'
import { BurnXUSD, MintXUSD } from '@/types/TransactionHistory'
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
    margin-bottom: 2.4rem;
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
    margin: 0 0.6rem 2.7rem 0.6rem;

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
    margin-bottom: 2.0rem;

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
  const { totalReward, escrowedReward, redeemableReward } = data
  const { refresh } = data

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

  const handleRedeem = () => {
    dowsJSConnector.dowsJs.FeePool.claimFees()
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

          tx.wait()
            .then(() => {
              refresh()
              transactionHistory.complete()
              dispatch(updateTransactionHistoryStatus(transactionHistory))
            })
            .catch(() => {
              transactionHistory.fail()
              dispatch(updateTransactionHistoryStatus(transactionHistory))
            })
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

          tx.wait()
            .then(() => {
              refresh()
              transactionHistory.complete()
              dispatch(updateTransactionHistoryStatus(transactionHistory))
            })
            .catch(() => {
              transactionHistory.fail()
              dispatch(updateTransactionHistoryStatus(transactionHistory))
            })
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
      <div className="header">
        <div className="item">
          <div className="title">Current Collateral</div>
          <div className="value">{myRatio}</div>
        </div>
        <div className="item">
          <div className="title">Target Collateral</div>
          <div className="value">{targetRatio}</div>
        </div>
      </div>
      <div className="button-row">
        <Button className="button" onClick={handleMintXusd}>
          Mint xUSD
        </Button>
        <Button className="button" onClick={handleBurnXusd}>
          Burn xUSD
        </Button>
      </div>
      <div className="text-container">
        <p className="bold">
          <span>Total DOWS</span>
          <span>{totalDows}</span>
        </p>
        <p>
          <span>Available</span>
          <span>{availableDows}</span>
        </p>
        <p>
          <span>Locked</span>
          <span>{lockedDows}</span>
        </p>
      </div>
      <div className="text-container">
        <p className="bold">
          <span>Total Rewards</span>
          <span>{numberWithCommas(totalReward, 6)}</span>
        </p>
        <p>
          <span>Escrowed</span>
          <span>{numberWithCommas(escrowedReward, 6)}</span>
        </p>
        <p>
          <span>Redeemable</span>
          <span>{numberWithCommas(redeemableReward, 6)}</span>
        </p>
      </div>
      <Button className="redeem-btn" onClick={handleRedeem} disabled={totalReward.lte(0)}>Redeem</Button>

      <AmountInputModal {...amountInputModalStatus} />
    </DowsInfoContainer>
  )
}

export default DowsSynthesizer
