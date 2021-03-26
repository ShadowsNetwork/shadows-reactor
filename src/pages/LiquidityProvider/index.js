import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import './index.less'
import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { fromWei } from '@/web3/utils'
import BigNumber from 'bignumber.js'
import uniswap from '@/img/liquidityProvider/uniswap.png'

async function getCurrentAPR() {
  const lp_to_dows = new BigNumber('33.22443529339985')

  const totalSupply = new BigNumber(fromWei(await dowsJSConnector.dowsJs.LpERC20Token.totalSupply()))

  const totalDows = lp_to_dows.multipliedBy(totalSupply)

  return `${new BigNumber('4.5e6').dividedBy(totalDows).multipliedBy('1e2').toFixed(2).toString(10)} %`
}

const LiquidityProvider = () => {
  const account = useSelector(getAccount)

  const [lpBalance, setLpBalance] = useState('')
  // const [totalLockedLpInUSD, setTotalLockedLpInUSD] = useState('')
  const [currentAPR, setCurrentAPR] = useState('')
  const [userLockedLp, setUserLockedLp] = useState('')
  // const [userLockedLpInUSD, setUserLockedLpInUSD] = useState('')
  const [dowsEarned, setDowsEarned] = useState('')

  const fetchData = useCallback(async () => {
    if (!account) {
      return
    }
    const [lpBalance, deposited, pending, currentAPR] = await Promise.all([
      dowsJSConnector.dowsJs.LpERC20Token.balanceOf(account),
      dowsJSConnector.dowsJs.Farm.deposited(0, account),
      dowsJSConnector.dowsJs.Farm.pending(0, account),
      getCurrentAPR()
    ])
    setLpBalance(fromWei(lpBalance))
    setUserLockedLp(fromWei(deposited))
    setDowsEarned(fromWei(pending))
    setCurrentAPR(currentAPR)
  }, [account])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const lock = async () => {
    const lpBalance = dowsJSConnector.dowsJs.LpERC20Token.balanceOf(account)
    const { contractAddress } = dowsJSConnector.dowsJs.Farm

    try {
      const approveResult = await dowsJSConnector.dowsJs.LpERC20Token.approve(contractAddress, lpBalance)
      console.log(approveResult)
      const confirmation = await approveResult.wait()
      console.log(confirmation)
      const depositResult = await dowsJSConnector.dowsJs.Farm.deposit(0, lpBalance)
      console.log(depositResult)
    } catch (e) {
      console.error(e)
    }

  }

  const unlock = async () => {
    const userInfo = await dowsJSConnector.dowsJs.Farm.userInfo(0, account)

    dowsJSConnector.dowsJs.Farm
      .withdraw(0, userInfo['amount'])
      .then(r => {
        console.log(r)
      })
      .catch(e => {
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

    //setDisable('');
  }

  return (
    <div className="liquidity">
      <div className="uniswap">
        <img src={uniswap}/>
        <span>Uniswap</span>
      </div>
      <div className="info-container">
        <div className="item">
          <div className="title">LP Tokens to Lock</div>
          <div className="value">{lpBalance}</div>
          <div className="additional">$2,434,654.34</div>
        </div>
        <div className="item">
          <div className="title">Current APR</div>
          <div className="value">{currentAPR}</div>
        </div>
        <div className="item">
          <div className="title">Your LP Locked</div>
          <div className="value">{userLockedLp}</div>
          <div className="additional">$2,434,654.34</div>
        </div>
        <div className="item">
          <div className="title">DOWS Earned</div>
          <div className="value">{dowsEarned}</div>
        </div>
      </div>
      <div className="button-container">
        <Button onClick={lock}>
          <PlusCircleOutlined />
        </Button>
        <Button onClick={unlock}>
          Unlock
        </Button>
        <Button onClick={claim}>
          Redeem
        </Button>
      </div>
    </div>
  )
}

export default LiquidityProvider
