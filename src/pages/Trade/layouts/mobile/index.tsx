import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { KeyPair, useCurrencyBalance } from '@/hooks/data/useTradeData'
import PairPanel from '@/pages/Trade/PairPanel'
import { BuySellPanel, BuySellPanelProps, CurrencyInfo, Stats } from '@/pages/Trade/components'
import {
  ContainerForBuyAndSell, ContainerForDowsAndPair, TradePageMobileLayoutContainer
} from './index.style'
import { SellBuyTabs } from '@/pages/Trade/layouts/desktop/index.style'

const TradePageMobileLayout: React.FC = () => {

  const { state } = useLocation<KeyPair | undefined>()

  const { data: balanceByCurrency } = useCurrencyBalance()

  const [selectedKeyPair, setSelectedKeyPair] = useState<KeyPair | undefined>(state)

  const [tradeActive, setTradeActive] = useState<BuySellPanelProps['type']>('Buy')

  const handleSelectedKeyPairChanged = (keyPair: KeyPair) => {
    setSelectedKeyPair(keyPair)
  }

  const handleSetTradeActive = (value: BuySellPanelProps['type']) => {
    setTradeActive(value)
  }

  return (
    <TradePageMobileLayoutContainer>
      <ContainerForDowsAndPair>
        <PairPanel
          onSelectedKeyPairChanged={handleSelectedKeyPairChanged}
          selectedKeyPair={selectedKeyPair}
        />
      </ContainerForDowsAndPair>
      <CurrencyInfo keyPair={selectedKeyPair} />
      <Stats keyPair={selectedKeyPair} />

      <SellBuyTabs>
        <div className="buy" onClick={() => handleSetTradeActive('Buy')}>Buy</div>
        <div className="sell" onClick={() => handleSetTradeActive('Sell')}>Sell</div>
      </SellBuyTabs>
      <ContainerForBuyAndSell>
        {
          tradeActive == 'Buy' && (
            <BuySellPanel
              balanceByCurrency={balanceByCurrency}
              color="#63cca9"
              type="Buy"
              keyPair={selectedKeyPair}
            />
          )
        }

        {
          tradeActive == 'Sell' && (
            <BuySellPanel
              balanceByCurrency={balanceByCurrency}
              color="#DB5E56"
              type="Sell"
              keyPair={selectedKeyPair}
            />
          )
        }

      </ContainerForBuyAndSell>
    </TradePageMobileLayoutContainer>
  )
}

export default TradePageMobileLayout
