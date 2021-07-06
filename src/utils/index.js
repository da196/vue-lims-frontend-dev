/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param{Object} object
 * @param {string | number} value
 * @returns {string | null}
 **/
export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value)
}

import Hashids from 'hashids'

export function encodeHashId(id) {
  const salt = process.env.VUE_APP_HASH_SALT
  const hashids = new Hashids(salt, 20) // pad to length 20
  return hashids.encode(id)
}

export function decodeHashId(id) {
  const salt = process.env.VUE_APP_HASH_SALT
  const hashids = new Hashids(salt, 20) // pad to length 20
  return hashids.decode(id)
}

export function camelToUnderscore(key) {
  return key.replace(/([A-Z])/g, '_$1')
}

export function camelToSpace(key) {
  return key.replace(/([A-Z])/g, ' $1').toUpperCase()
}

/**
 *
 * @param {array} arr target array
 * @param {number} current_position current index
 * @param {number} new_position new index
 * @returns array
 */
export function array_move(bag, current_position, new_position) {
  // local variables
  var i, tmp
  // cast input parameters to integers
  current_position = parseInt(current_position, 10)
  new_position = parseInt(new_position, 10)
  // if positions are different and inside array
  if (current_position !== new_position && current_position >= 0 && current_position <= bag.length && new_position >= 0 && new_position <= bag.length) {
    // save element from position 1
    tmp = bag[current_position]
    // move element down and shift other elements up
    if (current_position < new_position) {
      for (i = current_position; i < new_position; i++) {
        bag[i] = bag[i + 1]
      }
    } else {
      // move element up and shift other elements down

      for (i = current_position; i > new_position; i--) {
        bag[i] = bag[i - 1]
      }
    }
    // put element from position 1 to destination
    bag[new_position] = tmp

    return bag
  }
}

/**
 *
 * @param {object} object the object
 * @param {string} attribute
 * @returns
 */
export function nullableCheck(object, attribute) {
  if (object === null || object === undefined) return `No ${attribute}`
  return object[attribute]
}
