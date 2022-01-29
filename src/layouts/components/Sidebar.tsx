import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import React from 'react'
import '../app.less'
import routers from '@/router'
import { useLocation } from '@/hooks'
import styled from 'styled-components'

export const StyledMenu = styled(Menu)`
  background-color: rgba(14,17,26) !important;


  .ant-menu-item {
    margin: 16px 0;
    border-radius: 2.5rem;
  }

  .ant-menu-item.ant-menu-item-selected {
    background-color: #292528 !important;
  }
  
  .ant-menu-dark.ant-menu-inline {
    height: calc(100vh - 6.4rem);
    width: 23.316rem;
  }

  .ant-menu-dark.ant-menu-vertical {
    height: calc(100vh - 7.3rem);
    width: 6rem;
  }

  .ant-menu-inline-collapsed > .ant-menu-item .ant-menu-item-icon, .ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-item .ant-menu-item-icon, .ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-submenu > .ant-menu-submenu-title .ant-menu-item-icon, .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title .ant-menu-item-icon, .ant-menu-inline-collapsed > .ant-menu-item .anticon, .ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-item .anticon, .ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-submenu > .ant-menu-submenu-title .anticon, .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title .anticon {
    font-size: 1.6rem !important;
  }

  .ant-menu-item .ant-menu-item-icon, .ant-menu-submenu-title .ant-menu-item-icon, .ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
    font-size: 1.5rem !important;
    min-width: 1.4rem !important;
  }

  .ant-menu-item a {
    font-size: 1.4rem;
    color: #fff;
    font-weight: bold;
  }

  .ant-menu-dark.ant-menu-inline .ant-menu-item {
    margin-top: 2rem;
    display: flex;
    align-items: center;
  }

  .ant-menu-dark.ant-menu-vertical .ant-menu-item {
    margin-top: 1.5rem;
    border-radius: 2.5rem;
  }

  .ant-menu-dark .ant-menu-item-selected .ant-menu-item-icon + span,
  .ant-menu-dark .ant-menu-item-selected .anticon + span {
    color: #f64b78;
  }
  
`

const SideBar: React.FC<{ onItemSelected?: () => void}> = ({ onItemSelected }) => {
  const { hash } = useLocation()

  const handleClick = (key?: string) => {
    onItemSelected && onItemSelected()

    // @ts-ignore
    key && gtag('event', key)
  }

  return (
    <StyledMenu
      selectedKeys={[hash.slice(1)]}
      mode="inline"
      theme="dark"
    >
      {
        routers
          .map(router => (
            <Menu.Item
              key={router.path}
              onClick={() => handleClick(router.key)}
            >
              <img className="slideIcon" src={router.icon} alt="" />
              <Link to={router.path} style={{ userSelect: 'none' }}>
                {router.title}
              </Link>
            </Menu.Item>
          ))
      }
      <Menu.Item onClick={() => handleClick()}>
        <img className="slideIcon" src={require('@/img/menu-icons/liquidity-provider.png')} alt="pancake" />
        <a
          href={'https://exchange.pancakeswap.finance/#/add/0xfb7400707dF3D76084FBEae0109f41b178f71c02/BNB'}
          target="_blank"
          rel="noreferrer"
        >
          Provide Liquidity
        </a>
      </Menu.Item>
    </StyledMenu>
  )
}

export default SideBar
