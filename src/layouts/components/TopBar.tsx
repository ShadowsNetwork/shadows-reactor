import React, { useState } from 'react'
import Wallet from '@/components/Wallet'
import logo from '../../img/Logo.png'
import './index.less'
import useResponsive from '@/hooks/useResponsive'
import { MenuOutlined } from '@ant-design/icons'
import { Drawer } from 'antd'
import SideBar from '@/layouts/components/Sidebar'
import styled from 'styled-components'

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    background-color: rgba(14,17,26);
    padding: 24px 4px 4px 4px;
  }  
`

const TopBar: React.FC = () => {
  const { isMobile } = useResponsive()

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="top-bar">
        {
          isMobile && <MenuOutlined className='menu' onClick={() => setMenuOpen(true)} />
        }
        <span className="top-bar-logo"><img src={logo} alt="" /></span>
        <span className="beta-version">V1</span>
      </div>
      <Wallet />
      <StyledDrawer
        placement="left"
        closable={false}
        onClose={() => setMenuOpen(false)}
        visible={menuOpen}
      >
        <SideBar onItemSelected={() => setMenuOpen(false)} />
      </StyledDrawer>
    </div>
  )
}

export default TopBar

