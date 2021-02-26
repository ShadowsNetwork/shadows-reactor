import Web3 from "web3"
import BigNumber from "bignumber.js"

const utils = new Web3().utils

export function fromWei(value: any, decimalPlaces: number = 8) {
  return new BigNumber(utils.fromWei(value.toString())).dp(decimalPlaces).toString()
}

export function toWei(amount: number | string) {
  return toBigNumber(amount).multipliedBy(toBigNumber('1e+18')).toString(10)
}

export function isBN(value: any) {
  return utils.isBN(value)
}

export function toBN(value: any) {
  return utils.toBN(value)
}

export function toHex(value: any) {
  return utils.toHex(value)
}

export function toByte32(value: string) {
  return utils.rightPad(utils.asciiToHex(value), 64)
}

export function toBigNumber(value: string|number) {
  return new BigNumber(value)
}

