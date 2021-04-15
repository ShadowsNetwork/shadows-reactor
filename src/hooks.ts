import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { setAccount } from '@/store/wallet'
import routers from '@/router'

export function useLocation(): Location {
  const [location, setLocation] = useState(window.location)

  const listenToPopstate = () => {
    setLocation(window.location)
  }

  useEffect(() => {
    window.addEventListener('popstate', listenToPopstate)

    return () => {
      window.removeEventListener('popstate', listenToPopstate)
    }
  }, [])

  return location
}

export function useSetupEthereum(): void {
  const dispatch = useDispatch()

  useEffect(() => {
    const ethereum = (window as WindowChain).ethereum
    if (ethereum) {
      const { selectedAddress } = ethereum
      dispatch(setAccount(selectedAddress))

      ethereum.on('accountsChanged', (newAccount, oldAccount) => {
        console.log('on accounts changed: ', newAccount, oldAccount)
        dispatch(setAccount(newAccount[0]))
        window.location.reload()
      })
    }

    return () => {
      const ethereum = (window as WindowChain).ethereum
      if (ethereum) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        ethereum.removeListener('accountsChanged', () => {
        })
      }
    }
  }, [dispatch])
}

export function useDynamicBackgroundImage(): string {
  const [background, setBackground] = useState('')

  const { hash } = useLocation()
  const path = hash.replace(new RegExp('#/?'), '/')

  useEffect(() => {
    const currentRouter = routers.filter(router => router.path === path)[0]
    setBackground(currentRouter.backgroundImage)
  }, [hash])

  return background
}

