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

const App: React.FC = () => {
  useListenBridgeTransactionStatus()
  useListenBscTransaction()

  return (
    <Layout
      className="App"
      style={{
        // backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'black'
      }}
    >
      <Header style={{ padding: 0, backgroundColor: 'black', borderBottom: '0.2px solid #979797' }}>
        <TopBar />
      </Header>
      <Layout>
        <Sider width="23.316rem">
          <SideBar />
          <DowsInfo />
        </Sider>
        <Content style={{ display: 'flex', padding: '2rem 0 0 2rem' }}>
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
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
