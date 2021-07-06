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
            path: 'test-drag',
            name: 'testdrag',
            component: () => import('@/views/form/testdrag'),
            meta: { title: 'Altesl', icon: 'el-icon-folder', query_type: 'ALL', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          },
          {
            path: 'all',
            name: 'allLicences',
            component: () => import('@/views/licences/index'),
            meta: { title: 'All', icon: 'el-icon-folder', query_type: 'ALL', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          },
          {
            path: 'active-licences',
            name: 'activeLicence',
            component: () => import('@/views/licences/index'),
            meta: { title: 'Active', icon: 'el-icon-folder-checked', query_type: 'ACTIVE', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          },
          {
            path: 'new-applications',
            name: 'newLicenceApplications',
            component: () => import('@/views/licences/index'),
            meta: { title: 'New Applications', icon: 'el-icon-folder-opened', query_type: 'NEW', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          }, {
            path: 'in-progress',
            name: 'inProgressLicence',
            component: () => import('@/views/licences/index'),
            meta: { title: 'In-Progress', icon: 'el-icon-folder-remove', query_type: 'PROGRESS', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          }, {
            path: 'rejected',
            name: 'rejectedLicence',
            component: () => import('@/views/licences/index'),
            meta: { title: 'Rejected', icon: 'el-icon-folder-delete', query_type: 'REJECTED', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          }
        ]
      },
      // {
      //   path: '/individual-licences',
      //   component: Layout,
      //   redirect: '/individual-licences/all',
      //   name: 'individual Licences',
      //   meta: { title: 'Individual Licences', icon: 'el-icon-tickets', query_type: 'ALL', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'IL' },
      //   children: [
      //     {
      //       path: 'all',
      //       name: 'allIndividualLicences',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'All Licences', icon: 'el-icon-tickets', query_type: 'ALL', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'IL' }
      //     },
      //     {
      //       path: 'new-applications',
      //       name: 'newIndividualLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'New Applications', icon: 'el-icon-tickets', query_type: 'NEW', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'IL' }
      //     }, {
      //       path: 'in-progress',
      //       name: 'inProgressIndividualLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'In-Progress', icon: 'el-icon-tickets', query_type: 'PROGRESS', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'IL' }
      //     }, {
      //       path: 'rejected',
      //       name: 'rejectedIndividualLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'Rejected', icon: 'el-icon-tickets', query_type: 'REJECTED', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'IL' }
      //     }, {
      //       path: 'active-licences',
      //       name: 'activeIndividualLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'Active', icon: 'el-icon-tickets', query_type: 'ACTIVE', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'IL' }
      //     }
      //   ]
      // },
      // {
      //   path: '/numbering-licences',
      //   component: Layout,
      //   redirect: '/numbering-licences/all',
      //   name: 'numbering Licences',
      //   meta: { title: 'Numbering Licences', icon: 'el-icon-tickets', query_type: 'ALL', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'NL' },
      //   children: [
      //     {
      //       path: 'all',
      //       name: 'allNumberingLicences',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'All Licences', icon: 'el-icon-tickets', query_type: 'ALL', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'NL' }
      //     },
      //     {
      //       path: 'new-applications',
      //       name: 'newNumberingLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'New Applications', icon: 'el-icon-tickets', query_type: 'NEW', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'NL' }
      //     }, {
      //       path: 'in-progress',
      //       name: 'inProgressNumberingLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'In-Progress', icon: 'el-icon-tickets', query_type: 'PROGRESS', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'NL' }
      //     }, {
      //       path: 'rejected',
      //       name: 'rejectedNumberingLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'Rejected', icon: 'el-icon-tickets', query_type: 'REJECTED', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'NL' }
      //     }, {
      //       path: 'active-licences',
      //       name: 'activeNumberingLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'Active', icon: 'el-icon-tickets', query_type: 'ACTIVE', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'NL' }
      //     }
      //   ]
      // },
      // {
      //   path: '/type-approval-licences',
      //   component: Layout,
      //   redirect: '/type-licences/all',
      //   name: 'type Licences',
      //   meta: { title: 'Type Approval Licences', icon: 'el-icon-tickets', query_type: 'ALL', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'TAL' },
      //   children: [
      //     {
      //       path: 'all',
      //       name: 'allTypeLicences',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'All Licences', icon: 'el-icon-tickets', query_type: 'ALL', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'TAL' }
      //     },
      //     {
      //       path: 'new-applications',
      //       name: 'newTypeLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'New Applications', icon: 'el-icon-tickets', query_type: 'NEW', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'TAL' }
      //     }, {
      //       path: 'in-progress',
      //       name: 'inProgressTypeLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'In-Progress', icon: 'el-icon-tickets', query_type: 'PROGRESS', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'TAL' }
      //     }, {
      //       path: 'rejected',
      //       name: 'rejectedTypeLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'Rejected', icon: 'el-icon-tickets', query_type: 'REJECTED', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'TAL' }
      //     }, {
      //       path: 'active-licences',
      //       name: 'activeTypeLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'Active', icon: 'el-icon-tickets', query_type: 'ACTIVE', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'TAL' }
      //     }
      //   ]
      // },
      // {
      //   path: '/class-licences',
      //   component: Layout,
      //   redirect: '/class-licences/all',
      //   name: 'class Licences',
      //   meta: { title: 'Class Licences', icon: 'el-icon-tickets', query_type: 'ALL', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'CL' },
      //   children: [
      //     {
      //       path: 'all',
      //       name: 'allClassLicences',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'All Licences', icon: 'el-icon-tickets', query_type: 'ALL', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'CL' }
      //     },
      //     {
      //       path: 'new-applications',
      //       name: 'newClassLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'New Applications', icon: 'el-icon-tickets', query_type: 'NEW', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'CL' }
      //     }, {
      //       path: 'in-progress',
      //       name: 'inProgressClassLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'In-Progress', icon: 'el-icon-tickets', query_type: 'PROGRESS', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'CL' }
      //     }, {
      //       path: 'rejected',
      //       name: 'rejectedClassLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'Rejected', icon: 'el-icon-tickets', query_type: 'REJECTED', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'CL' }
      //     }, {
      //       path: 'active-licences',
      //       name: 'activeClassLicenceApplications',
      //       component: () => import('@/views/licences/index'),
      //       meta: { title: 'Active', icon: 'el-icon-tickets', query_type: 'ACTIVE', roles: ['ROLE_LICENSE_DETAIL_VIEW'], licenceCategory: 'CL' }
      //     }
      //   ]
      // },
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
          // {
          //   path: 'my-tasks/:selectedLicenceType/:userHash',
          //   name: 'MyTaskDetails',
          //   component: () => import('@/views/licences/tasks/taskAssignmentDetails'),
          //   meta: { title: 'License Details', icon: 'el-icon-tickets', query_type: 'NEW', roles: ['ROLE_LICENSE_DETAIL_VIEW'] }
          // }
        ]
      }
    ]
