
module.exports = [

  // roles list
  {
    url: '/v1/roles',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        status: 'Okay',
        message: 'Okay',
        data: {
          total: 2,
          content: [
            {
              id: 1,
              code: 'HOD',
              name: 'Head Of Department',
              createdAt: '2021-05-01 11:02'
            },
            {
              id: 2,
              code: 'LOF',
              name: 'Licence Officer Financial',
              createdAt: '2021-05-01 11:02'
            },
            {
              id: 3,
              code: 'LOT',
              name: 'Licence Officer Technical',
              createdAt: '2021-05-01 11:02'
            },
            {
              id: 4,
              code: 'DG',
              name: 'Director General',
              createdAt: '2021-05-01 11:02'
            }
          ]
        }
      }
    }
  }

]
