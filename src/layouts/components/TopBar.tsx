import React from 'react'
import Wallet from '@/components/Wallet'
import logo from '../../img/Logo.png'
import LanguageSelector from '@/components/LanguageSelector'
import './index.less'

const TopBar: React.FC = () => {
  return (
    <div className="top-bar">
      <img className="top-bar-logo" src={logo} alt="" />
      <Wallet />
      <LanguageSelector />
    </div>
  )
}

export default TopBar

