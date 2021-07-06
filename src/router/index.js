import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { settingRoutes } from '@/router/settings'
import { licenceRoutes } from '@/router/licences'
import { usersRoutes } from '@/router/users'
import { revenueRoutes } from '@/router/revenue'
import { PresentationsRoutes, reportsRoutes } from '@/router/reports'
import { taskRoutes } from '@/router/tasks'
import { applicationsRoutes } from './applications'
import { entityRoutes } from './entities'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    name: 'login'
  },
  {
    path: '/403',
    component: () => import('@/views/403'),
    hidden: true,
    name: '403'
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
    name: '404'
  }
]

export const dashboardRoutes = [{
  path: '/',
  component: Layout,
  redirect: 'dashboard/personal',
  meta: { title: 'Dashboard', icon: 'el-icon-data-analysis', breadcrumb: false },
  children: [{
    path: 'dashboard',
    name: 'DashboardPersonal',
    component: () => import('@/views/dashboard/index'),
    meta: { title: 'Dashboard', icon: 'el-icon-data-analysis', breadcrumb: false }
  },
  {
    path: 'dashboard/analysis',
    name: 'DashboardAnalysis',
    component: () => import('@/views/dashboard/expectedDashboard'),
    meta: { title: 'Expected-Dashboard', icon: 'el-icon-data-analysis' }
  },
  {
    path: 'dashboard/test',
    name: 'DashboardAnalysisTest',
    component: () => import('@/views/dashboard/analysisDashboard'),
    meta: { title: 'Dashboard-Analysis', icon: 'el-icon-data-analysis' }
  },
  /* {
    path: 'dashboard/original',
    name: 'DashboardAnalysisOg',
    component: () => import('@/views/dashboard/testComponent'),
    meta: { title: 'Dashboard-Analysis-Original', icon: 'el-icon-data-analysis' }
  },*/
  {
    path: 'dashboard/ministry',
    name: 'DashboardMinistry',
    component: () => import('@/views/dashboard/ministryDashboard'),
    meta: { title: 'Dashboard-Ministry', icon: 'el-icon-data-analysis', roles: ['ROLE_VIEW_LICENCE_STATS_REPORT', 'ROLE_VIEW_LICENCE_APPL_STATS_REPORT'] }
  }
  /* {
    path: 'dashboard/ministry2',
    name: 'DashboardMinistry2',
    component: () => import('@/views/dashboard/ministryDashboard2'),
    meta: { title: 'Dashboard-Ministry2', icon: 'el-icon-data-analysis', roles: ['ROLE_VIEW_LICENCE_STATS_REPORT', 'ROLE_VIEW_LICENCE_APPL_STATS_REPORT'] }
  }*/
  ]
}]

export const errorRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  ...dashboardRoutes,
  ...taskRoutes,
  ...applicationsRoutes,
  ...licenceRoutes,
  ...entityRoutes,
  ...PresentationsRoutes,
  ...revenueRoutes,
  ...reportsRoutes,
  ...usersRoutes,
  ...settingRoutes,
  ...errorRoutes
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
