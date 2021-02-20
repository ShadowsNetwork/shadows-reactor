import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"

function useBalanceQuery() {
  const context = useWeb3React()

  const {
    account,
    library,
    chainId
  } = context

  const [balance, setBalance] = useState<any | null | undefined>()

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    if (library) {
      library
        .getBalance(account)
        .then((res: any) => {
          setLoading(false)
          setBalance(res)
        })
        .catch(() => {
          setLoading(false)
          setBalance(null)
        })
    }
  }, [account, library, chainId])  // ensures refresh if referential identity of library doesn't change across chainIds

  return {
    loading,
    balance
  }
}

export default useBalanceQuery
