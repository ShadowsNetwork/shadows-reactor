import React from 'react'
import Wallet from '@/components/Wallet'
import logo from '../../img/Logo.png'
import './index.less'

const TopBar: React.FC = () => (
  <>
    <img className="top-bar-logo" src={logo} alt="" />
    <Wallet />
    {/*<LanguageSelector />*/}
  </>
)

export default TopBar

