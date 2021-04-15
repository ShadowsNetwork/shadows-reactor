interface WindowChain {
  ethereum?: {
    isMetaMask?: true
    request?: (..._: unknown[]) => Promise<any>
    selectedAddress?: string
    on: (_: string, ___: (___: unknown)=> unknown) => void
    removeListener: (_: string, ___: (___: unknown)=> unknown) => void
  }
}
