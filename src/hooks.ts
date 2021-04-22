import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import { getSelectedWallet, setAccount, setSelectedWallet } from '@/store/wallet'
import routers from '@/router'
import dowsJSConnector from '@/ShadowsJs/dowsJSConnector'

import { providers } from 'ethers'
import { getWeb3ProviderByWallet, WalletNames } from '@/web3/wallets'
import ContractSettings from '@/ShadowsJs/ContractSettings'

export function useLocation(): Location {
  const [location, setLocation] = useState(window.location)

  const listenToPopstate = () => {
    const { hash } = window.location
    console.log(hash)
    if (hash === '#/') {
      window.location.hash = '#/liquidity'
    }
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

export function useSetupProvider(): void {
  const dispatch = useDispatch()

  useEffect(() => {
    const ethereum = (window as WindowChain).ethereum
    if (ethereum) {
      const { selectedAddress } = ethereum
      dispatch(setAccount(selectedAddress))

      ethereum.on('accountsChanged', async (newAccount, oldAccount) => {
        console.log('on accounts changed: ', newAccount, oldAccount)
        if (!newAccount.length) {
          dispatch(setAccount(null))
          dispatch(setSelectedWallet(null))
        } else {
          dispatch(setAccount(newAccount[0]))
        }
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
  const path = hash.replace(new RegExp('(#/)?'), '/')

  useEffect(() => {
    const currentRouter = routers.filter(router => router.path === path)[0]
    setBackground(currentRouter?.backgroundImage)
  }, [hash])

  return background
}

export function useInitializeProvider(): boolean {
  const dispatch = useDispatch()
  const [initialized, setInitialized] = useState(false)
  const selectedWallet = useSelector(getSelectedWallet) as WalletNames

  const setup = useCallback(async () => {
    let provider: providers.Web3Provider | undefined
    try {
      provider = (await getWeb3ProviderByWallet(selectedWallet))

      if (!provider) {
        throw new Error('provider is null')
      }

      if (selectedWallet === 'WalletConnect') {
        setInitialized(true)
        return
      } else if (selectedWallet === 'Metamask' || selectedWallet === 'BSC') {
        // @ts-ignore
        await provider.provider.enable()

        // @ts-ignore
        provider.provider.on('accountsChanged', async (newAccount, oldAccount) => {
          console.log('on accounts changed: ', newAccount, oldAccount)
          if (!newAccount.length) {
            dispatch(setAccount(null))
            dispatch(setSelectedWallet(null))
          } else {
            dispatch(setAccount(newAccount[0]))
          }
        })
      }
    } catch (e) {
      dispatch(setAccount(null))
      dispatch(setSelectedWallet(null))
      return
    }

    if (!selectedWallet || !provider) {
      setInitialized(false)
      return
    }

    // console.log('web3 provider and signer: ', provider, provider.getSigner())
    dowsJSConnector.setContractSettings(new ContractSettings(
      provider,
      provider.getSigner ? provider.getSigner() : null,
      97
    ))
    setInitialized(true)
  }, [selectedWallet])

  useEffect(() => {
    setup()
  }, [setup])

  /*useEffect(() => {
    if (!selectedWallet || !provider) {
      setInitialized(false)
      return
    }
    const initProvider = async () => {
      // const web3Provider = new ethers.providers.Web3Provider(provider, 'any')

      // setSigner({
      //   networkId: 97,
      //   signer: web3Provider.getSigner()
      // })
      dowsJSConnector.setContractSettings({
        networkId: 97,
        provider: provider,
        // signer: provider.getSigner?.()
      })
      setInitialized(true)
      /!*provider.ready.then(network => {
        console.log('ready, network: ', network)
        const { chainId } = network
        if (!chainSupported(chainId)) {
          setupNetwork()
        }

        // setSigner({
        //   networkId: 97,
        //   signer: web3Provider.getSigner()
        // })
        // setInitialized(true)
      })*!/

      provider.on('network', (newNetwork, oldNetwork) => {
        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        if (oldNetwork) {
          window.location.reload()
        }
      })
    }
    initProvider()
  }, [selectedWallet, provider])*/
  return initialized
}

/*export function useAccount(): string | undefined {
  const selectedWallet = useSelector(getSelectedWallet) as WalletNames | undefined
  if (!selectedWallet) {
    return undefined
  }
  const provider = getWeb3ProviderByWallet(selectedWallet) as providers.Web3Provider
  switch (selectedWallet) {
  case 'Metamask':
    return (window as WindowChain).ethereum?.selectedAddress
  default:
    return undefined
  }
}*/

export type ErrorMessageGetter = (error: any) => string

export function useErrorMessage(): any {
  const selectedWallet = useSelector(getSelectedWallet) as WalletNames | undefined

  return useCallback((e: any) => {
    if (!selectedWallet) {
      return 'No Wallet Connected'
    } else if (selectedWallet === 'Metamask') {
      const detailMessage = e.data ? `: ${e.data.message}` : ''
      return `${e.message}${detailMessage}`
    } else if (selectedWallet === 'BSC') {
      return e.error
    } else if (selectedWallet === 'WalletConnect') {
      console.log('error', e)
      return 'WalletConnect error message'
    } else {
      throw new Error('Unknown selected wallet')
    }
  }, [selectedWallet])
}
