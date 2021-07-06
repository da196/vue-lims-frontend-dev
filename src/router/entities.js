import Layout from '@/layout'

export const entityRoutes =
    [
      {
        path: '/entities',
        component: Layout,
        redirect: '/entities/all',
        name: 'Entities',
        meta: { title: 'Entities', icon: 'el-icon-office-building', query_type: 'ALL', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' },
        children: [
          {
            path: 'all',
            name: 'allEntities',
            component: () => import('@/views/entities/index'),
            meta: { title: 'All', icon: 'el-icon-folder', query_type: 'ALL', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          },
          {
            path: 'active',
            name: 'activeEntities',
            component: () => import('@/views/entities/entityApplicationsIndex'),
            meta: { title: 'Entity Applications', icon: 'el-icon-folder-checked', query_type: 'ALL', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          },
          {
            path: 'notifications',
            name: 'entity.notifications',
            component: () => import('@/views/entities/notificationsList'),
            meta: { title: 'Entity Notifications', icon: 'el-icon-tickets' }
          }
        ]
      },
      {
        path: '/entity-details',
        component: Layout,
        name: 'EntityDetails',
        redirect: '/entities/all',
        hidden: true,
        children: [
          {
            path: 'all/:selectedLicenceType/:applicationId',
            name: 'entity.details',
            component: () => import('@/views/entities/entityDetails'),
            meta: { title: 'Entity Details', icon: 'el-icon-tickets', query_type: 'NEW', roles: ['ROLE_LICENSE_DETAIL_VIEW'] }
          },
          {
            path: 'details/:applicationId',
            name: 'entity.notifications.details',
            component: () => import('@/views/entities/notificationsList'),
            meta: { title: 'Entity Notifications', icon: 'el-icon-tickets', query_type: 'NEW', roles: ['ROLE_LICENSE_DETAIL_VIEW'] }
          }
        ]
      }
    ]
