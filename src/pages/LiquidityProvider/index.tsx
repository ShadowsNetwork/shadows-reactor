import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import './index.less'
import { Button, message } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { fromWei, toWei } from '@/web3/utils'
import BigNumber from 'bignumber.js'
import uniswap from '@/img/liquidityProvider/uniswap.png'
import AmountInputModal, { ModalStatus } from './amount-input-modal'
import useDowsPriceQuery from '@/queries/useDowsPriceQuery'
import { numberWithCommas } from '@/utils'

async function getCurrentAPR() {
  const lp_to_dows = new BigNumber('33.22443529339985')

  const totalSupply = new BigNumber(fromWei(await dowsJSConnector.dowsJs.LpERC20Token.totalSupply()))

  const totalDows = lp_to_dows.multipliedBy(totalSupply)

  return `${new BigNumber('4.5e6').dividedBy(totalDows)
    .multipliedBy('1e2')
    .toFixed(2)} %`
}

const LiquidityProvider: React.FC = () => {
  const account = useSelector(getAccount)

  const [modal, setModal] = useState<ModalStatus>({
    visible: false,
    title: '',
    confirmCallback: undefined,
    maxAvailable: ''
  })

  const dowsPrice = new BigNumber((useDowsPriceQuery().data as string))

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
  }, [account, dowsPrice])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const lock = async (amount: string) => {
    const lpBalance = await dowsJSConnector.dowsJs.LpERC20Token.balanceOf(account)
    const amountInWei = toWei(amount)
    console.log(lpBalance, amountInWei)

    if (new BigNumber(amountInWei).gt(new BigNumber(lpBalance))) {
      message.error('Insufficient balance.')
      return
    }

    const { contractAddress } = dowsJSConnector.dowsJs.Farm

    try {
      const approveResult = await dowsJSConnector.dowsJs.LpERC20Token.approve(contractAddress, amount)
      console.log(approveResult)
      const confirmation = await approveResult.wait()
      console.log(confirmation)
      const depositResult = await dowsJSConnector.dowsJs.Farm.deposit(0, lpBalance)
      console.log(depositResult)
    } catch (e) {
      console.error(e)
    }

  }

  const unlock = async (amount: string) => {
    const amountInWei = toWei(amount)

    dowsJSConnector.dowsJs.Farm
      .withdraw(0, amountInWei)
      .then((r: unknown) => {
        console.log(r)
      })
      .catch((e: Error) => {
        console.error(e)
      })
  }

  const claim = async () => {
    try {
      const withdrawResult = await dowsJSConnector.dowsJs.Farm.withdraw(0, 0)
      console.log(withdrawResult)

      const confirmation = await withdrawResult.wait()
      console.log(confirmation)
    } catch (error) {
      console.error(error)
    }
  }

  const cancelCallback = () => {
    setModal({
      ...modal,
      visible: false
    })
  }

  return (
    <div className="liquidity">
      <div className="uniswap">
        <img src={uniswap} alt="" />
        <span>Uniswap</span>
      </div>
      <div className="info-container">
        <div className="item">
          <div className="title">LP Tokens to Lock</div>
          <div className="value">{numberWithCommas(lpBalance)}</div>
          <div className="additional">
            {lpBalanceInUSD && '$' + numberWithCommas(lpBalanceInUSD)}
          </div>
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
          setModal({
            ...modal,
            maxAvailable: lpBalance,
            visible: true,
            title: 'Stake Liquidity',
            cancelCallback,
            confirmCallback: lock
          })
        }}>
          <PlusCircleOutlined />
        </Button>
        <Button onClick={() => {
          setModal({
            ...modal,
            maxAvailable: userLockedLp,
            visible: true,
            title: 'Unstake Liquidity',
            cancelCallback,
            confirmCallback: unlock
          })
        }}>
          Unlock
        </Button>
        <Button onClick={claim}>
          Redeem
        </Button>
      </div>
      <AmountInputModal {...modal} />
    </div>
  )
}

export default LiquidityProvider
