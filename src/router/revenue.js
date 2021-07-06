import Layout from '@/layout'

export const revenueRoutes =
    [
      {
        path: '/revenue',
        component: Layout,
        redirect: '/revenue/my-billed-applications',
        name: 'revenue',
        meta: { title: 'Revenue', icon: 'el-icon-money' },
        children: [
          /* {
            path: 'billings',
            name: 'billings',
            component: () => import('@/views/revenue/billings'),
            meta: { title: 'Billings', icon: 'el-icon-money' }
          },*/
          {
            path: 'new-billings',
            name: 'new-billings',
            component: () => import('@/views/revenue/new-billings'),
            meta: { title: 'Billings', icon: 'el-icon-money' }
          },
          {
            path: 'entity-billings',
            name: 'entityBillings',
            component: () => import('@/views/revenue/entityBills'),
            meta: { title: 'Entity Billings', icon: 'el-icon-money' }
          }

        ]
      }]

