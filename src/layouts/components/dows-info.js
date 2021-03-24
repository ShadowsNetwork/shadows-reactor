import { useSelector } from 'react-redux'
import { getAccount } from '@/store/wallet'
import React, { useCallback, useEffect, useState } from 'react'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'
import { fromWei } from '@/web3/utils'
import dowsIcon from '@/img/dows-info/dows.png'
import locationIcon from '@/img/dows-info/location.png'
import twitterIcon from '@/img/dows-info/twitter.png'

import './index.less'

const DowsInfo = () => {
  const account = useSelector(getAccount)

  const [dowsBalance, setDowsBalance] = useState('')

  const fetchData = useCallback(async () => {
    const balance = await dowsJSConnector.dowsJs.ERC20Token.balanceOf(account)
    setDowsBalance(fromWei(balance))
  }, [account])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="dows-info">
      <div className="dows-balance">
        <img src={dowsIcon} className="icon" alt="" />
        <div className="label">
          DOWS
        </div>
        <div className="value">
          {dowsBalance}
        </div>
      </div>
      <div>
        <img src={locationIcon} className="icon" alt="" />
        <img src={twitterIcon} className="icon" alt="" />
      </div>
    </div>
  )
}

export default DowsInfo
