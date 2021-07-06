import Layout from '@/layout'

export const usersRoutes =
  [
    {
      path: '/users',
      component: Layout,
      redirect: '/users/internal-staff',
      name: 'User Management',
      meta: { title: 'User Management', icon: 'el-icon-user', roles: ['ROLE_ROLE_VIEW_ALL', 'ROLE_USER_VIEW_ALL'] },
      children: [
        {
          path: 'internal-staff',
          name: 'Users.Internal',
          component: () => import('@/views/configurations/usersConfig/internal'),
          meta: { title: 'Internal Staff', icon: 'el-icon-set-up', roles: ['ROLE_ROLE_VIEW_ALL', 'ROLE_USER_VIEW_ALL'] }
        },
        {
          path: 'applicant-users',
          name: 'Users.Applicants',
          component: () => import('@/views/configurations/usersConfig/applicants'),
          meta: { title: 'Applicants', icon: 'el-icon-set-up', roles: ['ROLE_ROLE_VIEW_ALL', 'ROLE_USER_VIEW_ALL'] }
        },
        {
          path: 'roles',
          name: 'Users.Roles',
          component: () => import('@/views/configurations/usersConfig/userRoles/index'),
          meta: { title: 'Roles', icon: 'el-icon-set-up', roles: ['ROLE_ROLE_VIEW_ALL'] }
        }
      ]
    }]

