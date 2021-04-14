interface WindowChain {
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => Promise<any>
    selectedAddress?: string
    on: (method: string, Function) => void
    removeListener: (method: string, Function) => void
  }
}
