import React from 'react'
import { useHomeData } from '@/hooks/data/useHomeData'
import { toBigNumber } from '@/web3/utils'
import { numberWithCommas } from '@/utils'
import { ShadowsSynth, shadowsSynthsConfig } from '@/config/img.config'
import { StatInfoContainer } from '@/pages/Home/index.css'

const StatPanel: React.FC = () => {
  const { yourBalance, dowsBalance, debtPool, assetsBalanceList, netTradingBalance } = useHomeData()

  const newNetTradingBalance = netTradingBalance >= toBigNumber(0) ? `$${numberWithCommas(netTradingBalance)}` : numberWithCommas(netTradingBalance).replace('-', '-$')

  const currencyIcon = (key: string) => {
    const map = shadowsSynthsConfig.find((item: ShadowsSynth) => item.symbol === key)
    return require(`../../img/coin/${map?.symbol || 'ShaUSD'}.png`)
  }

  return (
    <StatInfoContainer>
      <div className="summary-row">
        <div className="summary-item">
          <div className="label">Your Balance</div>
          <div className="value">${numberWithCommas(yourBalance)}</div>
        </div>
        <div className="summary-item">
          <div className="label">DOWS Balance</div>
          <div className="value">${numberWithCommas(dowsBalance)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Net Trading Balance</div>
          <div className="value">{newNetTradingBalance}</div>
        </div>
      </div>
      <div className="asset-list">
        <div className="column">
          <div className="header">Asset</div>
          {
            assetsBalanceList.map(asset => (
              <div className="item" key={asset.key}>
                <span>
                  {
                    <img
                      className="icon"
                      src={currencyIcon(asset.key)}
                      alt={asset.key}
                    />
                  }
                </span>
                {asset.key}
              </div>
            ))
          }
          <div className="item" style={{ marginLeft: '3.5rem' }}>My Debt</div>
        </div>
        <div className="column">
          <div className="header">Qty</div>
          {
            assetsBalanceList.map(asset => (
              <div className="item" key={asset.key}>
                {numberWithCommas(asset.quantity, 6)}
              </div>
            ))
          }
          <div className="item">-</div>
        </div>
        <div className="column">
          <div className="header">Value</div>
          {
            assetsBalanceList.map(asset => (
              <div className="item" key={asset.key}>
                ${numberWithCommas(asset.value)}
              </div>
            ))
          }
          <div className="item">(${numberWithCommas(debtPool)})</div>
        </div>
      </div>
    </StatInfoContainer>
  )
}

export default StatPanel
