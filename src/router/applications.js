import Layout from '@/layout'

export const applicationsRoutes =
    [
      {
        path: '/applications',
        component: Layout,
        redirect: '/applications/all',
        name: 'Applications',
        meta: { title: 'Applications', icon: 'el-icon-document-copy' },
        children: [
          {
            path: 'all',
            name: 'allApplications',
            component: () => import('@/views/applications/index'),
            meta: { title: 'All', icon: 'el-icon-document-copy', query: 'all' }
          },
          {
            path: 'new',
            name: 'newApplications',
            component: () => import('@/views/applications/index'),
            meta: { title: 'New', icon: 'el-icon-document-copy', query: 'new' }
          },
          {
            path: 'in-progress',
            name: 'inProgress',
            component: () => import('@/views/applications/index'),
            meta: { title: 'In Progress', icon: 'el-icon-document-copy', query: 'inProgress' }
          },
          {
            path: 'with-ministry',
            name: 'withMinistry',
            component: () => import('@/views/applications/index'),
            meta: { title: 'With Ministry', icon: 'el-icon-document-copy', query: 'ministry' }
          }
        ]
      }]

