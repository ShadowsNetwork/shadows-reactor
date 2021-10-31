import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { appendTransactionHistory, getAccount } from '@/store/wallet'
import AmountInputModal, { AmountInputModalStatus } from '@/pages/Staking/AmountInputModal'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { toByte32, toWei, weiToBigNumber, weiToString } from '@/web3/utils'
import { Button, Popover } from 'antd'
import styled from 'styled-components'
import { useDowsSynthesizerData } from '@/hooks/useDowsSynthesizerData'
import { BurnXUSD, MintXUSD, RedeemDOWS, RedeemXUSD } from '@/types/TransactionHistory'
import { useTransactionStatusModal } from '@/contexts/TransactionStatusModalContext'
import { useErrorMessage } from '@/hooks'
import { numberWithCommas } from '@/utils'

import { InfoCircleFilled } from '@ant-design/icons'

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
      transition: all 0.2s linear;
      &:hover{
        border-color: #ffffff;
        transform:translate(0, 4px);
      }
      &[disabled]{
        &:hover{
          border-color: #979797;
          transform:translate(0, 0);
        }
      }
    }
  }

  .text-container {
    width:100%;
    padding: 0 1.2rem;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    line-height: 0.6;
    margin-bottom: 2rem;

    .bold {
      font-size: 1.3rem;
      color: #979797;
    }

    p {
      display: flex;
      justify-content: space-between;
      line-height:1;
      margin-bottom:0.7rem;
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

const TipDiv = styled.div`
  .tip{
    padding:1rem;
    p{
      line-height:1.5;
      margin:0;
    }
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
  const { totalFees, redeemableFees, totalRewards, escrowedRewards, redeemableRewards, vestingScheduleTime } = data

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

  const redeemXusd = () => {
    beginTransaction()
    dowsJSConnector.dowsJs.FeePool.claimFees()
      .then(tx => {
        const th: RedeemXUSD = new RedeemXUSD(tx.hash, numberWithCommas(redeemableFees, 6))
        dispatch(appendTransactionHistory(th))
        submitTransaction()
      }).catch(e => {
        rejectTransaction(errorMessageGetter(e))
      })
  }

  const redeemDows = () => {
    beginTransaction()
    dowsJSConnector.dowsJs.RewardEscrow.vest()
      .then(tx => {
        const th: RedeemDOWS = new RedeemDOWS(tx.hash, numberWithCommas(redeemableRewards, 6))
        dispatch(appendTransactionHistory(th))
        submitTransaction()
      }).catch(e => {
        rejectTransaction(errorMessageGetter(e))
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
      title: 'Mint ShaUSD',
      maxAvailable: weiToString(remainingIssuableSynths),
      cancelCallback: closeAmountInputModal,
      confirmCallback: issueSynth,
      unit: 'ShaUSD'
    })

    // @ts-ignore
    gtag('event', 'handle_mint_xusd')
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

    const [_debtBalance, _balanceOf] = await Promise.all([
      dowsJSConnector.dowsJs.Synthesizer.debtBalanceOf(account!, toByte32('ShaUSD')),
      dowsJSConnector.dowsJs.Synth.balanceOf('ShaUSD', account!)
    ])
    setAmountInputModalStatus({
      ...amountInputModalStatus,
      visible: true,
      title: 'Burn ShaUSD',
      maxAvailable: weiToBigNumber(_debtBalance).minus(weiToBigNumber(_balanceOf)) > weiToBigNumber(0) ? weiToBigNumber(_balanceOf) : weiToBigNumber(_debtBalance),
      cancelCallback: closeAmountInputModal,
      confirmCallback: burnSynths,
      unit: 'ShaUSD'
    })

    // @ts-ignore
    gtag('event', 'handle_burn_xusd')
  }

  const feeTip = () => {
    return (
      <TipDiv>
        <div className="tip">
          <p>100% transaction fees generated on the platform are rewarded <br />back to the users who contribute to the debt pool. <br />xUSD rewards are distributed based on the share of the debt pool. </p>
          <br />
          <p>-‘Total ShaUSD Rewards’ is updated in real time.</p>
          <p>-‘Redeemable’ is updated every 1 weeks.</p>
        </div>
      </TipDiv>
    )
  }

  const rewardTip = () => {
    const week = vestingScheduleTime.mod(60 * 60 * 24 * 7)
    const day = vestingScheduleTime.mod(60 * 60 * 24)
    const hour = vestingScheduleTime.mod(60 * 60)
    const min = vestingScheduleTime.mod(60)
    let _vestingScheduleTime
    if (week.toString() === '0') {
      _vestingScheduleTime = (vestingScheduleTime.div(60 * 60 * 24 * 7)).toString() + ' weeks'
    } else if (day.toString() === '0') {
      _vestingScheduleTime = (vestingScheduleTime.div(60 * 60 * 24)).toString() + ' days'
    } else if (hour.toString() === '0') {
      _vestingScheduleTime = (vestingScheduleTime.div(60 * 60)).toString() + ' hours'
    } else if (min.toString() === '0') {
      _vestingScheduleTime = (vestingScheduleTime.div(60)).toString() + ' minutes'
    } else {
      _vestingScheduleTime = vestingScheduleTime.toString() + ' seconds'
    }

    return (
      <TipDiv>
        <div className="tip">
          <p>In addition to the ShaUSD rewards, users also gain extra DOWS. </p>
          <br />
          <p>- ‘Total DOWS Rewards’ is updated in real time.</p>
          <p>- When the ShaUSD rewards are redeemed, an equivalent value of <br />DOWS will show up under ‘Escrowed’.</p>
          <p>- After an escrow (i.e. vesting) period of {_vestingScheduleTime}, the DOWS <br />rewards will become redeemable.</p>
        </div>
      </TipDiv>
    )
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
      <div className="button-row" style={{ marginBottom: '2.8rem' }}>
        <Button className="button handle_mint_xusd" onClick={handleMintXusd} id="handle_mint_xusd" disabled={!account}>
          Mint ShaUSD
        </Button>
        <Button className="button handle_burn_xusd" onClick={handleBurnXusd} id="handle_burn_xusd" disabled={!account}>
          Burn ShaUSD
        </Button>
      </div>
      <div className="text-container" style={{ marginBottom: '2rem' }}>
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
      <div className="text-container" style={{ marginBottom: '2rem' }}>
        <p className="bold">
          <span>Total ShaUSD Rewards&nbsp;
            <Popover trigger="hover" content={feeTip}>
              <InfoCircleFilled style={{ color: '#63CCA9' }} />
            </Popover>
          </span>
          <span>${numberWithCommas(totalFees, 6)}</span>
        </p>
        <p>
          <span>Redeemable </span>
          <span>${numberWithCommas(redeemableFees, 6)}</span>
        </p>
      </div>
      <div className="text-container" style={{ marginBottom: '1.5rem' }}>
        <p className="bold">
          <span>Total DOWS Rewards&nbsp;
            <Popover trigger="hover" content={rewardTip}>
              <InfoCircleFilled style={{ color: '#63CCA9' }} />
            </Popover>
          </span>
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
          onClick={redeemXusd}
          disabled={redeemableFees.lte(0)}
          style={{ fontSize: '1.3rem' }}
        >
          Redeem ShaUSD
        </Button>
        <Button
          className="button"
          onClick={redeemDows}
          disabled={redeemableRewards.lte(0)}
          style={{ fontSize: '1.3rem' }}
        >
          Redeem DOWS
        </Button>
      </div>

      <AmountInputModal {...amountInputModalStatus} />
    </DowsInfoContainer >
  )
}

export default DowsSynthesizer
