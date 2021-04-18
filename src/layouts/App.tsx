import routers from '@/router'
import React from 'react'
import SideBar from '@/layouts/components/Sidebar'
import { Route } from 'react-router-dom'
import TopBar from '@/layouts/components/TopBar'
import DowsInfo from '@/layouts/components/DowsInfo'
import { useDynamicBackgroundImage, useInitializeProvider } from '@/hooks'

const App: React.FC = () => {
  const background = useDynamicBackgroundImage()
  // useSetupProvider()

  const providerInitialized = useInitializeProvider()

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'black'
      }}
    >
      <SideBar />
      <DowsInfo />
      <TopBar />
      {
        providerInitialized && routers.map(router => (
          <Route
            path={router.path}
            exact
            component={router.component}
            key={router.key}
          />
        ))
      }
    </div>
  )
}

export default App
