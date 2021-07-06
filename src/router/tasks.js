import Layout from '@/layout'

export const taskRoutes =
    [
      {
        path: '/tasks',
        component: Layout,
        redirect: '/tasks/my-tasks',
        name: 'Activities',
        meta: { title: 'Activities', icon: 'el-icon-finished', query_type: 'ALL', roles: ['ROLE_LICENSE_VIEW_ALL'] },
        children: [
          {
            path: 'all',
            name: 'allTasks',
            component: () => import('@/views/tasks/allTasks'),
            meta: { title: 'All Activities', icon: 'el-icon-folder', query_type: 'ALL', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          },
          {
            path: 'my-tasks',
            name: 'my-tasks',
            component: () => import('@/views/tasks/my'),
            meta: { title: 'My Activities', icon: 'el-icon-finished', query_type: 'ALL', roles: ['ROLE_LICENSE_VIEW_ALL'], licenceCategory: 'ALL' }
          },
          {
            path: 'task-details/:selectedLicenceType/:applicationId/:taskHash',
            name: 'MyDetails',
            component: () => import('@/views/tasks/show'),
            hidden: true,
            meta: { title: 'Activity Details', icon: 'el-icon-tickets', query_type: 'NEW' }
          }
        ]
      }
      // {
      //   path: '/details',
      //   component: Layout,
      //   name: 'applicationDetailsRoute',
      //   redirect: '/details/task-details',
      //   hidden: true,
      //   children: [
      //     {
      //       path: 'task-details/:selectedLicenceType/:applicationId/:taskHash',
      //       name: 'MyDetails',
      //       component: () => import('@/views/tasks/show'),
      //       meta: { title: 'License Details', icon: 'el-icon-tickets', query_type: 'NEW' }
      //     }
      //   ]
      // }
    ]

