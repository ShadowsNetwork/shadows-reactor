import logoURL from '@/img/logotext.png'
import logoImg from '@/img/logoImg.png'
import React from 'react'

function LogoText() {
  return (
    // <img src={logoURL} style={{width:"160px",position:"absolute",top:"40px",left:"20px"}}/>
    <img
      src={logoURL}
      style={{
        width: '160px',
        marginTop: '30px',
        marginBottom: '30px',
        marginLeft: '20px',
      }}
      alt='' />
  )
}

function LogoImg() {
  return (
    <img
      src={logoImg}
      style={{
        width: '19.02px',
        marginTop: '30px',
        marginLeft: '15px',
        marginBottom: '30px',
      }}
      alt='' />
  )
}

function LogoSet(props) {
  return props.collapsed ? <LogoImg /> : <LogoText />
}

export default LogoSet
