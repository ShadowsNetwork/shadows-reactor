import Web3 from "web3"

const utils = new Web3().utils

export function fromWei(value: string) {
  return utils.fromWei(value)
}

export function isBN(value: any) {
  return utils.isBN(value)
}

export function toByte32(value: string) {
  return utils.rightPad(utils.asciiToHex(value), 64)
}
