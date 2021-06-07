import BigNumber from 'bignumber.js'

export function numberWithCommas(x: string | number | BigNumber, decimalPlace = 2): string {
  // if (!x) {
  //   return numberWithCommas('0')
  // }

  const trimTrailingZero = (x: string) => {
    if (x.length <= decimalPlace) {
      return x.padEnd(decimalPlace, '0')
    }

    return x[x.length - 1] !== '0' ? x : trimTrailingZero(x.substring(0, length - 1))
  }

  const parts: string[] = new BigNumber(x).toFixed(decimalPlace).split('.')

  parts[0] = (parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')) ?? '0'

  if (!parts[1]) {
    parts[1] = '0'.repeat(decimalPlace)
  } else {
    parts[1] = trimTrailingZero(parts[1])
  }

  return parts.join('.')
}

export function dateFormat(date: Date, format: string): string {
  const o = {
    'M+': date.getMonth() + 1,                 //月份
    'd+': date.getDate(),                    //日
    'h+': date.getHours(),                   //小时
    'm+': date.getMinutes(),                 //分
    's+': date.getSeconds(),                 //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds()             //毫秒
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return format
}
