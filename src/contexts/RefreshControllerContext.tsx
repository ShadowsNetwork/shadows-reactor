import React, { useContext, useEffect, useState } from 'react'

const FAST_INTERVAL = 3000
const SLOW_INTERVAL = 30000

const RefreshControllerContext = React.createContext({
  fast: 0,
  slow: 0,
  refresh: () => {
    return
  }
})

const RefreshControllerProvider: React.FC = ({ children }) => {
  const [slow, setSlow] = useState(0)
  const [fast, setFast] = useState(0)

  const refresh = () => {
    setFast(prev => prev + 1)
    setSlow(prev => prev + 1)
  }

  useEffect(() => {
    const fastInterval = setInterval(async () => {
      setFast(prev => prev + 1)
    }, FAST_INTERVAL)

    const slowInterval = setInterval(async () => {
      setSlow(prev => prev + 1)
    }, SLOW_INTERVAL)

    return () => {
      clearInterval(fastInterval)
      clearInterval(slowInterval)
    }
  }, [])

  return (
    <RefreshControllerContext.Provider
      value={{ slow, fast, refresh }}
    >
      {children}
    </RefreshControllerContext.Provider>
  )
}

const useRefreshController = () => {
  const { slow, fast, refresh } = useContext(RefreshControllerContext)
  return {
    slowRefreshFlag: slow,
    fastRefreshFlag: fast,
    forceRefresh: refresh
  }
}

export {
  RefreshControllerProvider, useRefreshController
}

