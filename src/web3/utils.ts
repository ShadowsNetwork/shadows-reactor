import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'

export const web3Utils = new Web3().utils

export function addressAvailable(address?: string | null): boolean {
  return !!address && web3Utils.isAddress(address)
}

export function toBigNumber(value: string | number): BigNumber {
  return new BigNumber(value)
}

export function weiToBigNumber(value?: string | number | BN, decimalPlaces = 18): BigNumber {
  if (!value) {
    return new BigNumber(0)
  }

  return new BigNumber(web3Utils.fromWei(value.toString())).dp(decimalPlaces, BigNumber.ROUND_DOWN)
}

export function weiToString(value: string | number | BN, decimalPlaces = 18): string {
  return weiToBigNumber(value, decimalPlaces)
    .toFixed(decimalPlaces)
}

export function toWei(amount: number | string): string {
  return toBigNumber(amount)
    .multipliedBy(toBigNumber('1e+18'))
    .toString(10)
}

export function toHex(value: string | number): string {
  return web3Utils.toHex(value)
}

export function toByte32(value: string): string {
  return web3Utils.rightPad(web3Utils.asciiToHex(value), 64)
}

export function bytesToString(bytes: string): string {
  const result = web3Utils.hexToAscii(bytes)
  return result.replace(/\0/g, '')
}

