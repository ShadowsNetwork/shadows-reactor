import React from 'react'
import dowsIcon from '@/img/dows-info/dows.png'
import locationIcon from '@/img/dows-info/location.png'
import twitterIcon from '@/img/dows-info/twitter.png'

import './index.less'
import useDowsPrice from '@/queries/useDowsPrice'
import { numberWithCommas } from '@/utils'

const DowsInfo: React.FC = () => {
  const dowsPrice = useDowsPrice()

  return (
    <div className="dows-info">
      <div className="dows-balance">
        <img src={dowsIcon} className="icon" alt="" />
        <div className="label">
          DOWS
        </div>
        <div className="label dollar">$</div>
        <div className="value">
          {numberWithCommas(dowsPrice, 6)}
        </div>
      </div>
      <div>
        <a href={'https://t.me/Shadows_defi'} target="_blank" rel="noreferrer"><img src={locationIcon} className="icon" alt="" /></a>
        <a href={'https://twitter.com/shadows_defi'} target="_blank" rel="noreferrer"><img src={twitterIcon} className="icon" alt="" /></a>
      </div>
    </div>
  )
}

export default DowsInfo
