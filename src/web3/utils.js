import Web3 from 'web3';
import BigNumber from 'bignumber.js';
const utils = new Web3().utils;
export function toBigNumber(value) {
    return new BigNumber(value);
}
export function fromWei(value, decimalPlaces = 8) {
    return new BigNumber(utils.fromWei(value.toString())).dp(decimalPlaces)
        .toString();
}
export function toWei(amount) {
    return toBigNumber(amount)
        .multipliedBy(toBigNumber('1e+18'))
        .toString(10);
}
export function toHex(value) {
    return utils.toHex(value);
}
export function toByte32(value) {
    return utils.rightPad(utils.asciiToHex(value), 64);
}
export function bytesToString(bytes) {
    const result = utils.hexToAscii(bytes);
    return result.replace(/\0/g, '');
}
//# sourceMappingURL=utils.js.map