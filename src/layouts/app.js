import routers from '@/router'
import React, { useState } from 'react'
import Map from '@/img/background/map.jpg'
import SideBar from '@/layouts/components/sidebar'
import { Route } from 'react-router-dom'
import Wallet from '@/components/wallet'
import LanguageSelector from '@/components/LanguageSelector'
import DowsInfo from '@/layouts/components/dows-info'

const App = () => {

  const { hash } = window.location
  const currentRouter = routers.filter(router => router.path === hash.slice(1))[0]

  const [background, setBackground] = useState(currentRouter ? currentRouter.backgroundImage : Map)

  const handleNavItemClicked = router => {
    setBackground(router.backgroundImage)
  }

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
      <SideBar onNavItemClicked={handleNavItemClicked} />

      <DowsInfo />

      <Wallet />

      <LanguageSelector />

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
