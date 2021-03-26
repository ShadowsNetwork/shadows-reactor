import React from 'react'
import './index.css'
import Wallet from '@/components/wallet'
import logo from '../../img/Logo.png'
import LanguageSelector from '@/components/LanguageSelector'

function Top() {
  return (
    <div className="top">
      <img className="logo" src={logo}/>
      <Wallet />
      <LanguageSelector/>
    </div>
  )
}

export  default Top
