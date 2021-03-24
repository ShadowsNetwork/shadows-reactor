import textLogo from '@/img/logotext.png'
import imageLogo from '@/img/logoImg.png'
import React from 'react'

const TextLogo = () => (
  <img
    src={textLogo}
    style={{
      width: '160px'
    }}
    alt=""
  />
)

const ImageLogo = () => (
  <img
    src={imageLogo}
    style={{
      width: '19.02px'
    }}
    alt=""
  />
)

const LogoSet = ({ collapsed }) => collapsed ? <ImageLogo /> : <TextLogo />

export default LogoSet
