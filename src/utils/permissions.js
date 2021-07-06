import localStorage from 'store'
import { BROWSER_PERMITS } from '@/store/mutation-types'
/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    // const roles = store.getters && store.getters.roles
    const roles = localStorage.get(BROWSER_PERMITS)
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })
    return hasPermission
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
