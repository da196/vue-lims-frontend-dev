import localStorage from 'store'
import { USER_EMAIL } from '@/store/mutation-types'
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.email ? state.user.email : localStorage.get(USER_EMAIL),
  user_id: state => state.user.user_id,
  routesConfigured: state => state.user.routesConfigured,
  permission_routes: state => state.permissions.routes,
  intervalRef: state => state.user.intervalRef

}
export default getters
