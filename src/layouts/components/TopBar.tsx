import React from 'react'
import Wallet from '@/components/Wallet'
import logo from '../../img/Logo.png'
import './index.less'

const TopBar: React.FC = () => (
  <>
    <div className="top-bar">
      <span className="top-bar-logo" ><img src={logo} alt="" /></span>
      <span className="beta-version">BETA V1</span>
    </div>
    <Wallet />
    {/*<LanguageSelector />*/}
  </>
)

export default TopBar

