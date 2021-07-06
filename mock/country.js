const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    description: '@sentence(10, 20)',
    name: '@name'
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/country/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 200,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
