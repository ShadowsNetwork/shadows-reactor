import Web3 from 'web3'
import BigNumber from 'bignumber.js'

const utils = new Web3().utils

export function toBigNumber(value: string | number): BigNumber {
  return new BigNumber(value)
}

export function fromWei(value: string | number, decimalPlaces = 8): string {
  return new BigNumber(utils.fromWei(value.toString())).dp(decimalPlaces)
    .toString()
}

export function toWei(amount: number | string): string {
  return toBigNumber(amount)
    .multipliedBy(toBigNumber('1e+18'))
    .toString(10)
}

export function toHex(value: string | number): string {
  return utils.toHex(value)
}

export function toByte32(value: string): string {
  return utils.rightPad(utils.asciiToHex(value), 64)
}

export function bytesToString(bytes: string): string {
  const result = utils.hexToAscii(bytes)
  return result.replace(/\0/g, '')
}

