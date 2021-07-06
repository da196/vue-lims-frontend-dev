module.exports = [
  // Charges ...
  {
    url: '/v1/bills/1/charges',
    type: 'get',
    response: config => {
      return {
        'code': 2000,
        'message': 'Success',
        'status': true,
        'data': {},
        'dataList': [
          {
            'id': 1,
            'bill': {
              'all billing details': 1
            },
            'fee': {
              'code': '',
              'name': 'Application Fee',
              'amount': '10000',
              'currency': 'USD'
            },
            'status': 'PAID',
            'descriptions': 'Fee for the application',
            'createdAt': '2021-01-21 19:12'
          },
          {
            'id': 1,
            'bill': {
              'all billing details': 1
            },
            'fee': {
              'code': '',
              'name': 'Initial License Fee',
              'amount': '2400',
              'currency': 'USD'
            },
            'status': 'PAID',
            'descriptions': 'Fee for the application',
            'createdAt': '2021-01-21 19:12'
          }

        ]
      }
    }
  },

  // Bills ...
  {
    url: '/v1/bills',
    type: 'get',
    response: config => {
      return {
        'code': 2000,
        'message': 'Success',
        'status': true,
        'data': {},
        'dataList': [
          {
            'id': 1,
            'billingNumber': 'WF01',
            'controlNumber': '9910203455646545',
            'currency': 'USD',
            'amount': 124000,
            'amount_pending': 12000,
            'issuedDate': '',
            'expireDate': '',
            'status': 'PAID',
            'gepgStatus': 0,
            'descriptions': 'Lorem Ipsum ...',
            'createdAt': '2021-01-21 19:12',
            'fees': [
              { 'id': 1,
                'amount': 12000,
                'feeType': 'APPLICATION_FEE',
                'status': 'PAID' },
              {
                'id': 1,
                'amount': 12000,
                'feeType': 'PROCESSING_FEE',
                'status': 'PAID'
              }
            ],
            'licence': {
              'id': 1,
              'name': '',
              'applicant': {
                'name': 'Vodacom PLC',
                'representative': {
                  'name': 'John Pashok Nchimbi'
                }
              },
              'licenceProduct': {
                'id': 1,
                'name': 'LP 1'
              }
            }
          }
        ]
      }
    }
  }

]
