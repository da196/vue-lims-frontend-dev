import Layout from '@/layout'

export const licenceRoutes =
    [
      {
        path: '/licences',
        component: Layout,
        redirect: '/licences/all',
        name: 'Licences',
        meta: { title: 'Licences', icon: 'el-icon-news', query_type: 'ALL', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' },
        children: [
          {
            path: 'all',
            name: 'allLicences',
            component: () => import('@/views/licences/index'),
            meta: { title: 'All', icon: 'el-icon-folder-checked', query_type: 'ALL', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          },
          {
            path: 'active',
            name: 'activeLicence',
            component: () => import('@/views/licences/index'),
            meta: { title: 'Active', icon: 'el-icon-folder-checked', query_type: 'ACTIVE', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          },
          {
            path: 'expired',
            name: 'expiredLicence',
            component: () => import('@/views/licences/index'),
            meta: { title: 'Expired', icon: 'el-icon-folder-remove', query_type: 'EXPIRED', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          },
          {
            path: 'suspended',
            name: 'suspendedLicences',
            component: () => import('@/views/licences/index'),
            meta: { title: 'Suspended', icon: 'el-icon-folder-remove', query_type: 'SUSPENDED', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          }, {
            path: 'cancelled',
            name: 'cancelledLicence',
            component: () => import('@/views/licences/index'),
            meta: { title: 'Cancelled', icon: 'el-icon-folder-remove', query_type: 'CANCELLED', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          }
        ]
      },
      {
        path: '/licences-details',
        component: Layout,
        name: 'license details',
        redirect: '/licences-details/all',
        hidden: true,
        children: [
          {
            path: 'all/:selectedLicenceType/:userHash',
            name: 'allLicenceDetails',
            component: () => import('@/views/licences/show'),
            meta: { title: 'License Details', icon: 'el-icon-tickets', query_type: 'NEW', roles: ['ROLE_LICENSE_DETAIL_VIEW'] }
          }
        ]
      }
    ]
