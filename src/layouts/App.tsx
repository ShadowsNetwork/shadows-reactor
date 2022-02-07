import routers from '@/router'
import React from 'react'
import SideBar from '@/layouts/components/Sidebar'
import { Route } from 'react-router-dom'
import TopBar from '@/layouts/components/TopBar'
import DowsInfo from '@/layouts/components/DowsInfo'
import { useListenBridgeTransactionStatus, useListenBscTransaction } from '@/hooks'
import { Layout } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import useFixupNetwork from '@/hooks/useFixupNetwork'
import styled from 'styled-components'
import useResponsive from '@/hooks/useResponsive'

const StyledSider = styled(Sider)`
  background-color: rgba(14,17,26);
  
  @media screen and (max-width: 1080px) {
    position: absolute;
    z-index: 9999;
    width: 50vw;
  }
`

const StyledContent = styled(Content)`
  display: flex;
  width: fit-content;
  height: 100%;
  padding: 2.5rem 0 0 2.5rem;
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 1em;
  }

  &::-webkit-scrollbar-track {
    background: linear-gradient(90deg, #434343, #434343 1px, #111 0, #111);
  }

  &::-webkit-scrollbar-thumb {
    background: #434343;
    border-radius: 16px;
    box-shadow: inset 2px 2px 2px hsl(0deg 0% 100% / 25%), inset -2px -2px 2px rgb(0 0 0 / 25%);
  }
  
  @media screen and (max-width: 1080px) {
    width: 100vw;
    padding: 3.75vw;
    height: fit-content;
    min-height: calc(100vh - 64px);

    &::-webkit-scrollbar {
      width: 7.5px;
    }
  }
`

const App: React.FC = () => {
  useListenBridgeTransactionStatus()
  useListenBscTransaction()
  useFixupNetwork()

  const { isDesktop } = useResponsive()

  return (
    <Layout
      className="App"
      style={{
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'black'
      }}
    >
      <Header style={{ padding: 0, backgroundColor: 'black', borderBottom: '0.2px solid #979797' }}>
        <TopBar />
      </Header>
      <Layout style={{ position: 'relative' }}>
        {isDesktop &&(
          <StyledSider width="23.316rem">
            {<SideBar />}
            <DowsInfo />
          </StyledSider>
        )}
        <StyledContent>
          {
            routers.map(router => (
              <Route
                path={router.path}
                exact
                component={router.component}
                key={router.key}
              />
            ))
          }
        </StyledContent>
      </Layout>
    </Layout>
  )
}

export default App
