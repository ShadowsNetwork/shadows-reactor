import React from 'react'
import Wallet from '@/components/Wallet'
import logo from '../../img/Logo.png'
import './index.less'
import { useWeb3EnvContext } from '@/contexts/Web3EnvContext'
import { useSelector } from 'react-redux'
import { getSelectedWallet } from '@/store/wallet'
import { WalletNames } from '@/web3/wallets'
import { setupBinanceWalletNetwork, setupMetamaskNetwork } from '@/ShadowsJs/networkHelper'
import useRequiredChain from '@/hooks/useRequiredChain'

const TopBar: React.FC = () => {
  const { networkReady } = useWeb3EnvContext()
  const selectedWallet = useSelector(getSelectedWallet) as WalletNames
  const requiredChain = useRequiredChain()!

  const fixupNetwork = () => {
    if (selectedWallet === 'Metamask') {
      setupMetamaskNetwork(requiredChain)
    } else if (selectedWallet === 'BSC') {
      setupBinanceWalletNetwork(requiredChain)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="top-bar">
        <span className="top-bar-logo"><img src={logo} alt="" /></span>
        <span className="beta-version">V1</span>
      </div>
      {!networkReady && (
        <span
          style={{ color: 'red', userSelect: 'none' }}
          onClick={fixupNetwork}
        >
          Not in correct network, click me to fix
        </span>
      )}
      <Wallet />
      {/*<LanguageSelector />*/}
    </div>
  )
}

export default TopBar

