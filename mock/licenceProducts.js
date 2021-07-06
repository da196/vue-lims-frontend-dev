module.exports = [
// licences list small
  // licences list
  {
    url: '/v1/licence-products',
    type: 'get',
    response: config => {
      return {
        'code': 2000,
        'message': 'Success',
        'status': true,
        'dataList': [
          {
            'id': 1,
            'code': 'LP1',
            'name': 'IL AP WO',
            'displayName': '',
            'description': '',
            'status': 'active'
          },
          {
            'id': 2,
            'code': 'LP2',
            'name': 'IL AP W',
            'displayName': '',
            'description': '',
            'status': 'active'
          },
          {
            'id': 3,
            'code': 'LP3',
            'name': 'IL AP ONLY',
            'displayName': '',
            'description': '',
            'status': 'active'
          },

          {
            'id': 4,
            'code': 'LP14',
            'name': 'IL NF',
            'displayName': '',
            'description': '',
            'status': 'active'
          }
        ],
        'data': {}
      }
    }
  }
]
