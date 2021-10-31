import React from 'react'
import Wallet from '@/components/Wallet'
import logo from '../../img/Logo.png'
import './index.less'

const TopBar: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="top-bar">
        <span className="top-bar-logo"><img src={logo} alt="" /></span>
        <span className="beta-version">V1</span>
      </div>
      <Wallet />
    </div>
  )
}

export default TopBar

