import Layout from '@/layout'

// TODO ->  the reports route is incomplete, pending further clarification from BA
export const reportsRoutes =
    [
      {
        path: '/reports',
        component: Layout,
        redirect: '/reports/my-application-reports',
        name: 'Reports',
        meta: { title: 'Reports', icon: 'el-icon-data-line' },
        children: [
          {
            path: 'licence-reports',
            name: 'licenceReports',
            component: () => import('@/views/reports/licenceReports'),
            meta: { title: 'Licences', icon: 'el-icon-data-line' }
          },
          {
            path: 'application-reports',
            name: 'applicationReports',
            component: () => import('@/views/reports/applicationReports'),
            meta: { title: 'Licence Application', icon: 'el-icon-data-line' }
          }

          // {
          //   path: 'my-application-reports',
          //   name: 'myApplicationReports',
          //   component: () => import('@/views/reports/myApplicationReports'),
          //   meta: { title: 'My Reports', icon: 'el-icon-data-line' }
          // }
          // {
          //   path: 'billing',
          //   name: 'billingReports',
          //   component: () => import('@/views/reports/billingReports'),
          //   meta: { title: 'Billing Reports', icon: 'el-icon-data-line' }
          // },
          // {
          //   path: 'application-reports',
          //   name: 'applicationReports',
          //   component: () => import('@/views/reports/applicationReports'),
          //   meta: { title: 'Licence Application', icon: 'el-icon-data-line' }
          // }
          // {
          //   path: 'application',
          //   name: 'applicationReport',
          //   component: () => import('@/views/reports/applicationReport'),
          //   meta: { title: 'Application', icon: 'el-icon-data-line' }
          // }
        ]
      }]

export const PresentationsRoutes = [
  {
    path: '/presentations',
    component: Layout,
    redirect: '/presentations/all',
    name: 'Presentations',
    meta: { title: 'Presentations', icon: 'el-icon-data-board' },
    children: [
      {
        path: 'all',
        name: 'allPresentations',
        component: () => import('@/views/presentations/allPresentations'),
        meta: { title: 'All Presentations', icon: 'el-icon-data-board' }
      }
    ]
  }
]
