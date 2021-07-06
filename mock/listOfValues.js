const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    'active|1': [true, false],
    'approved|1': [true, false],
    date_created: '@datetime',
    description: '@sentence(10, 20)',
    'list_type|1': ['Currency', 'Category'],
    // title: '@sentence(10, 20)',
    // 'status|1': ['published', 'draft', 'deleted'],
    name: 'name',
    parent_id: null,
    unique_id: '@guid'
    // display_time: '@datetime',
    // pageviews: '@integer(300, 5000)'
  }]
})

module.exports = [
  {
    url: '/v1/listOfValues',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        status: 'Okay',
        message: 'Okay',
        data: {
          total: items.length,
          content: [
            {
              id: 1,
              active: true,
              approved: true,
              date_created: '1990-09-09 11:33',
              description: 'Lorem Ipsum',
              'list_type': 'Currency',
              code: 'TZS',
              name: 'Tanzania Shillings',
              parent_id: null
            },
            {
              id: 2,
              active: true,
              approved: true,
              date_created: '1985-09-09 14:33',
              description: 'Lorem Ipsum',
              list_type: 'Country',
              code: 'TZ',
              name: 'Tanzania',
              parent_id: 1
            }
          ]
        }
      }
    }
  }
]
