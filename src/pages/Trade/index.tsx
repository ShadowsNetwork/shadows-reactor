import React from 'react'
import useResponsive from '@/hooks/useResponsive'
import TradePageMobileLayout from './layouts/mobile'
import TradePageDesktopLayout from './layouts/desktop'

const TradePage: React.FC = () => {
  const { isDesktop } = useResponsive()

  return isDesktop ? <TradePageDesktopLayout /> : <TradePageMobileLayout />
}

export default TradePage
