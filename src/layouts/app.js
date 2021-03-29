import routers from '@/router'
import React from 'react'
import SideBar from '@/layouts/components/sidebar'
import { Route } from 'react-router-dom'
import Top from '@/components/Top'
import DowsInfo from '@/layouts/components/dows-info'
import { useDynamicBackgroundImage, useSetupEthereum } from '@/hooks'

const App = () => {
  const background = useDynamicBackgroundImage()
  useSetupEthereum()

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

      <Top />

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
    </div>
  )
}

export default App
