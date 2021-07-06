import Layout from '@/layout'

export const settingRoutes =
  [
    {
      path: '/settings',
      component: Layout,
      redirect: '/settings/workflows/all',
      name: 'Configurations',
      meta: { title: 'Configurations', icon: 'el-icon-setting' },
      children: [
        {
          path: 'workflows/all',
          name: 'Workflow.Index',
          component: () => import('@/views/configurations/workflows/index'),
          meta: { title: 'Workflows', icon: 'el-icon-set-up', roles: ['ROLE_WORKFLOW_VIEW_ALL', 'ROLE_WORKFLOW_VIEW'] }
        },
        {
          path: 'workflows/create',
          name: 'Workflow.Create',
          hidden: true,
          component: () => import('@/views/configurations/workflows/create'),
          meta: {
            title: 'Create Workflow',
            icon: 'el-icon-set-up',
            roles: ['ROLE_WORKFLOW_SAVE', 'ROLE_WORKFLOW_EDIT', 'ROLE_WORKFLOW_TYPE_VIEW_ALL', 'ROLE_WORKFLOW_VIEW']
          }
        },
        {
          path: 'workflows/edit/:Id',
          name: 'Workflow.Edit',
          hidden: true,
          component: () => import('@/views/configurations/workflows/edit'),
          meta: {
            title: 'Edit Workflow',
            icon: 'el-icon-set-up',
            roles: ['ROLE_WORKFLOW_SAVE', 'ROLE_WORKFLOW_EDIT', 'ROLE_WORKFLOW_TYPE_VIEW_ALL', 'ROLE_WORKFLOW_VIEW']
          }
        },
        {
          path: 'workflows/:Id',
          name: 'Workflow.Show',
          hidden: true,
          component: () => import('@/views/configurations/workflows/show'),
          meta: {
            title: 'Show Workflow',
            icon: 'el-icon-set-up',
            roles: ['ROLE_WORKFLOW_VIEW', 'ROLE_WORKFLOW_VIEW_ALL']
          }
        },
        {
          path: 'licence-products/all',
          name: 'LicenceProducts.Index',
          component: () => import('@/views/configurations/licenceProducts/index'),
          meta: {
            title: 'Licence Product',
            icon: 'el-icon-set-up',
            roles: ['ROLE_PRODUCT_VIEW', 'ROLE_PRODUCT_VIEW_ALL']
          }
        },
        {
          path: 'entity-products/all',
          name: 'EntityProducts.Index',
          component: () => import('@/views/configurations/entityProducts/index'),
          meta: {
            title: 'Entity Product',
            icon: 'el-icon-set-up',
            roles: ['ROLE_PRODUCT_VIEW', 'ROLE_PRODUCT_VIEW_ALL']
          }
        },
        {
          path: 'licence-forms/all',
          name: 'LicenceForm.Index',
          component: () => import('@/views/configurations/licenceForms/index'),
          meta: { title: 'Licence Forms', icon: 'el-icon-set-up', roles: ['ROLE_LICENSE_FORM_VIEW', 'ROLE_LICENSE_FORM_VIEW_ALL']
          }
        },
        {
          path: 'itemType/:parentId',
          name: 'itemType',
          hidden: true,
          component: () => import('@/views/configurations/licenceForms/itemType'),
          meta: { title: 'Licence Forms Items', icon: 'el-icon-set-up', roles: ['ROLE_LICENSE_FORM_ITEM_VIEW'] }
        },
        {
          path: 'notification/all',
          name: 'Notification.Index',
          component: () => import('@/views/configurations/notification/index'),
          meta: {
            title: 'Notification Template',
            icon: 'el-icon-set-up',
            roles: ['ROLE_NOTIFICATION_TEMPLATE_VIEW', 'ROLE_NOTIFICATION_TEMPLATE_VIEW_ALL']
          }
        },
        {
          path: 'exchange-rate/all',
          name: 'Exchange-rate.Index',
          component: () => import('@/views/configurations/exchangeRate/index'),
          meta: {
            title: 'Exchange Rates',
            icon: 'el-icon-set-up',
            roles: ['ROLE_EXCHANGE_RATE_VIEW', 'ROLE_EXCHANGE_RATE_VIEW_ALL']
          }
        },
        {
          path: 'licence-fees/all',
          name: 'LicenceFee.Index',
          component: () => import('@/views/configurations/licenceFees/index'),
          meta: {
            title: 'Licence Fees',
            icon: 'el-icon-set-up',
            roles: ['ROLE_FEE_STRUCTURE_VIEW', 'ROLE_FEE_STRUCTURE_VIEW_ALL']
          }
        },
        {
          path: 'licence-category/all',
          component: () => import('@/views/configurations/licenceCategory/index'),
          meta: {
            title: 'Licence Category',
            icon: 'el-icon-set-up',
            roles: ['ROLE_LICENSE_CATEGORY_VIEW_ALL', 'ROLE_LICENSE_CATEGORY_VIEW']
          }
        },
        {
          path: 'sub-items/:subCategoryType/:parentId',
          name: 'subItems',
          hidden: true,
          component: () => import('@/views/configurations/licenceCategory/subCategory'),
          meta: {
            title: 'Licence Sub-Category',
            icon: 'el-icon-set-up',
            roles: ['ROLE_LICENSE_CATEGORY_VIEW', 'ROLE_LICENSE_CATEGORY_VIEW_ALL']
          }
        },
        {
          path: 'service-group',
          name: 'serviceGroup',
          component: () => import('@/views/configurations/licenceServices/serviceGroup'),
          meta: {
            title: 'Services',
            icon: 'el-icon-set-up',
            roles: ['ROLE_LICENSE_DETAIL_VIEW', 'ROLE_LICENSE_DETAIL_VIEW_ALL']
          }
        },
        {
          path: 'geo-location',
          name: 'GeoLocation',
          component: () => import('@/views/configurations/geolocation/listGeolocations'),
          meta: {
            title: 'GeoLocation',
            icon: 'el-icon-set-up',
            roles: ['ROLE_GEOLOCATION_VIEW_ALL', 'ROLE_GEOLOCATION_VIEW']
          }
        },
        {
          path: 'attachment-types',
          name: 'AttachmentTypes',
          component: () => import('@/views/configurations/attachmentTypes/index'),
          meta: { title: 'Attachment Types', icon: 'el-icon-set-up', roles: ['ROLE_ATTACHMENTS_TYPE_VIEW_ALL'] }
        },
        {
          path: 'entity-categories',
          name: 'EntityCategories',
          component: () => import('@/views/configurations/entityCategories/index'),
          meta: { title: 'Entity Categories', icon: 'el-icon-set-up', roles: ['ROLE_ENTITY_CATEGORY_VIEW_ALL'] }
        },
        {
          path: 'list-of-values',
          name: 'listOfValues',
          component: () => import('@/views/configurations/listOfValueSettings/index'),
          meta: {
            title: 'List of Values',
            icon: 'el-icon-set-up',
            roles: ['ROLE_LIST_OF_VALUES_VIEW', 'ROLE_LIST_OF_VALUES_VIEW_ALL']
          }
        },
        {
          path: 'licence-statuses',
          name: 'licenceStatus',
          component: () => import('@/views/configurations/licenceStatus/index'),
          meta: {
            title: 'Licence Status',
            icon: 'el-icon-set-up',
            roles: ['ROLE_STATUS_VIEW_ALL', 'ROLE_STATUS_VIEW', 'ROLE_STATUS_VIEW_ACTIVE']
          }
        }
      ]
    }]

