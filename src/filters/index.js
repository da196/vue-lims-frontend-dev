// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * @param {boolean} status
 * @return {string}
*/
export function globalStatusFilter(status) {
  const statusMap = {
    true: 'success',
    false: 'danger'
  }
  return statusMap[status]
}

/**
 * @param {string} status
 * @return {string}
 */
export function applicationStateFilter(status) {
  const statusMap = {
    'NEW': '',
    'RENEW': 'info',
    'UPGRADE': 'warning',
    'TRANSFER': 'warning',
    'CANCELLATION': 'danger'
  }
  return statusMap[status.trim()]
}

/**
 * @param{string} status
 * @return{string}
 *  */
export function datetimeFilter(status) {
  const d = new Date(status)
  return d.toDateString()
  // return d.toLocaleDateString()
  // return d.toGMTString()
}
/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 *
 */
export function statusFilter(status) {
  const statusMap = {
    active: 'success',
    draft: 'gray',
    deleted: 'danger',
    incomplete: 'info'
  }
  return statusMap[status] ?? status
}

export function defaultNull(data) {
  return data ?? 'N/A'
}

/**
 *
 * @param status
 * @return {string}
 * @constructor
 */

export function DecisionFilter(status) {
  const decisionMap = {
    RECOMMEND: 'Recommended',
    ASSIGN: 'Assigned Officers',
    APPROVE: 'Approved Action',
    RESUBMIT: 'Resubmitted',
    REJECT: 'Rejected',
    REVISE: 'Requested Revision of previous activity',
    COMPLETE: 'Marked as Complete',
    SAVE: 'Saved as draft',
    NO_OBJECTION: 'No objection',
    OBJECTION: 'Objection raised',
    INVITE: 'Invited Applicant',
    ACKNOWLEDGE: 'Acknowledged',
    CONSULT_MINISTRY: 'Consult with the ministry',
    AGREED: 'Agreed'
  }
  return decisionMap[status] ?? uppercaseFirst(status)
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string?.charAt(0)?.toUpperCase() + string?.slice(1).toLowerCase()
}

export function groupBy(xs, f) {
  if (xs === undefined) {
    return undefined
  } else {
    // eslint-disable-next-line no-sequences
    return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {})
  }
}
