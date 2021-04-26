interface WindowChain {
  ethereum?: {
    isMetaMask?: true
    request: (..._arg: unknown[]) => Promise<any>
    selectedAddress?: string
    on: (_event: string, _callback: (..._arg) => void) => void
    removeListener: (_event: string, _callback: (..._arg) => unknown) => void
  },
  BinanceChain?: unknown
}
