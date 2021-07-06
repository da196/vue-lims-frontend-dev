module.exports = [
// licences list small
  {
    url: '/v1/licences',
    type: 'get',
    response: config => {
      return {
        'code': 2000,
        'message': 'Success',
        'status': true,
        'dataList': [{
          'id': 1,
          'applicant': {
            'name': 'Tigo Tanzania'
          },
          'licenseGroupName': 'Individual License',
          'licenceName': 'Network Facility License'
        }],
        'data': {}
      }
    }
  },
  // licences list
  {
    url: '/v1/licences',
    type: 'get',
    response: config => {
      return {
        'code': 2000,
        'message': 'Success',
        'status': true,
        'dataList': [
          {
            'id': 1,
            'licenseGroupName': 'Individual License',
            'licenceName': 'Network Facility License',
            'services': [
              {
                'licenseGroupName': 'Individual License',
                'licenceName': 'Network Facility License',
                'serviceName': 'Cabling',
                'serviceLevel': 'International',
                'serviceCoverage': []
              },
              {
                'licenseGroupName': 'Individual License',
                'licenceName': 'Network Facility License',
                'serviceName': 'NetworkService',
                'serviceLevel': 'District',
                'serviceCoverage': ['ARS', 'MWZ', 'DAR']
              }
            ],
            'nature_of_services': '',
            'coverage': '',
            'estimationCost': 110000,
            'commencementDate': '2021-01-23 11:50',
            'futurePlans': '',
            'anyOtherRelevantInfo': '',
            'attachments': [
              {
                'id': 1,
                'name': 'Network Diagram',
                'uri': 'attachments/12/network.diagram.pdf',
                'description': 'The network diagram',
                'createdAt': '2021-01-23 11:50',
                'status': 'active',
                'attachmentType': {
                  'name': 'Network Diagram',
                  'isPrimary': true,
                  'createdAt': '2021-01-23 11:50'
                }
              },
              {
                'id': 2,
                'name': 'Service Pricing',
                'uri': 'attachments/12/service.pricing.pdf',
                'description': 'The Service diagram',
                'createdAt': '2021-01-23 11:50',
                'status': 'active',
                'attachmentType': {
                  'name': 'IndividualLicense',
                  'isPrimary': true,
                  'createdAt': '2021-01-23 11:50'
                }
              }],
            'applicant': {
              'applicantType': 'Company',
              'name': 'Vodacom Tanzania PLC',
              'telephone': '270123456789',
              'fax': '270123456789',
              'email': 'compliance@vodacom.co.tz',
              'website': 'vodacom.co.tz',
              'representative': {
                'firstName': '',
                'middleName': '',
                'lastName': '',
                'email': '',
                'phone': '',
                'gender': '',
                'geolocations': {
                  'region': 'DAR',
                  'district': 'KINONDONI',
                  'addressType': '',
                  'postalCode': '',
                  'postalAddress': ''
                }
              },
              'addresses': [
                {
                  'city': 'Dar es salaam',
                  'street': 'Mwai Kibaki Road',
                  'Plot No': ''
                }],
              'shareholders': [
                {
                  'name': 'John Done PLC',
                  'shares_percent': 12.12,
                  'citizenship': 'TZ'
                },
                {
                  'name': 'John Doe PLC',
                  'shares_currency': 'USD',
                  'shares_percent': 41.12,
                  'citizenship': 'TZ'

                }
              ],
              'share_capital_currency': 'TZS',
              'share_capital_value': 200000000,
              'status': 'active'
            },
            'status': 'active',
            'createdAt': '2021-01-23 11:50',
            '_links': {
              'self': {
                'href': 'http://localhost:8080/licences/1'
              },
              'employees': {
                'href': 'http://localhost:8080/licences'
              }
            }
          },
          {
            'id': 2,
            'licenseGroupName': 'Individual License',
            'licenceName': 'Network Facility License',
            'services': [
              {
                'licenseGroupName': 'Individual License',
                'licenceName': 'Network Facility License',
                'serviceName': 'Cabling',
                'serviceLevel': 'International',
                'serviceCoverage': []
              },
              {
                'licenseGroupName': 'Individual License',
                'licenceName': 'Network Facility License',
                'serviceName': 'NetworkService',
                'serviceLevel': 'District',
                'serviceCoverage': ['ARS', 'MWZ', 'DAR']
              }
            ],
            'nature_of_services': '',
            'coverage': '',
            'estimationCost': 110000,
            'commencementDate': '2021-01-23 11:50',
            'futurePlans': '',
            'anyOtherRelevantInfo': '',
            'attachments': [
              {
                'id': 1,
                'name': 'Network Diagram',
                'uri': 'attachments/12/network.diagram.pdf',
                'description': 'The network diagram',
                'createdAt': '2021-01-23 11:50',
                'status': 'active',
                'attachmentType': {
                  'name': 'Network Diagram',
                  'isPrimary': true,
                  'createdAt': '2021-01-23 11:50'
                }
              },
              {
                'id': 2,
                'name': 'Service Pricing',
                'uri': 'attachments/12/service.pricing.pdf',
                'description': 'The Service diagram',
                'createdAt': '2021-01-23 11:50',
                'status': 'active',
                'attachmentType': {
                  'name': 'IndividualLicense',
                  'isPrimary': true,
                  'createdAt': '2021-01-23 11:50'
                }
              }],
            'applicant': {
              'applicantType': 'Company',
              'name': 'Airtel Tanzania',
              'telephone': '270123456789',
              'fax': '270123456789',
              'email': 'compliance@vodacom.co.tz',
              'website': 'vodacom.co.tz',
              'representative': {
                'firstName': '',
                'middleName': '',
                'lastName': '',
                'email': '',
                'phone': '',
                'gender': '',
                'geolocations': {
                  'region': 'DAR',
                  'district': 'KINONDONI',
                  'addressType': '',
                  'postalCode': '',
                  'postalAddress': ''
                }
              },
              'addresses': [
                {
                  'city': 'Dar es salaam',
                  'street': 'Mwai Kibaki Road',
                  'Plot No': ''
                }],
              'shareholders': [
                {
                  'name': 'John Done PLC',
                  'shares_percent': 12.12,
                  'citizenship': 'TZ'
                },
                {
                  'name': 'John Doe PLC',
                  'shares_currency': 'USD',
                  'shares_percent': 41.12,
                  'citizenship': 'TZ'

                }
              ],
              'share_capital_currency': 'TZS',
              'share_capital_value': 200000000,
              'status': 'active'
            },
            'status': 'expired',
            'createdAt': '2021-01-23 11:50',
            '_links': {
              'self': {
                'href': 'http://localhost:8080/licences/1'
              },
              'employees': {
                'href': 'http://localhost:8080/licences'
              }
            }
          },
          {
            'id': 3,
            'licenseGroupName': 'Individual License',
            'licenceName': 'Network Facility License',
            'services': [
              {
                'licenseGroupName': 'Individual License',
                'licenceName': 'Network Facility License',
                'serviceName': 'Cabling',
                'serviceLevel': 'International',
                'serviceCoverage': []
              },
              {
                'licenseGroupName': 'Individual License',
                'licenceName': 'Network Facility License',
                'serviceName': 'NetworkService',
                'serviceLevel': 'District',
                'serviceCoverage': ['ARS', 'MWZ', 'DAR']
              }
            ],
            'nature_of_services': '',
            'coverage': '',
            'estimationCost': 110000,
            'commencementDate': '2021-01-23 11:50',
            'futurePlans': '',
            'anyOtherRelevantInfo': '',
            'attachments': [
              {
                'id': 1,
                'name': 'Network Diagram',
                'uri': 'attachments/12/network.diagram.pdf',
                'description': 'The network diagram',
                'createdAt': '2021-01-23 11:50',
                'status': 'active',
                'attachmentType': {
                  'name': 'Network Diagram',
                  'isPrimary': true,
                  'createdAt': '2021-01-23 11:50'
                }
              },
              {
                'id': 2,
                'name': 'Service Pricing',
                'uri': 'attachments/12/service.pricing.pdf',
                'description': 'The Service diagram',
                'createdAt': '2021-01-23 11:50',
                'status': 'active',
                'attachmentType': {
                  'name': 'IndividualLicense',
                  'isPrimary': true,
                  'createdAt': '2021-01-23 11:50'
                }
              }],
            'applicant': {
              'applicantType': 'Company',
              'name': 'Zantel Tanzania',
              'telephone': '270123456789',
              'fax': '270123456789',
              'email': 'compliance@vodacom.co.tz',
              'website': 'vodacom.co.tz',
              'representative': {
                'firstName': '',
                'middleName': '',
                'lastName': '',
                'email': '',
                'phone': '',
                'gender': '',
                'geolocations': {
                  'region': 'DAR',
                  'district': 'KINONDONI',
                  'addressType': '',
                  'postalCode': '',
                  'postalAddress': ''
                }
              },
              'addresses': [
                {
                  'city': 'Dar es salaam',
                  'street': 'Mwai Kibaki Road',
                  'Plot No': ''
                }],
              'shareholders': [
                {
                  'name': 'John Done PLC',
                  'shares_percent': 12.12,
                  'citizenship': 'TZ'
                },
                {
                  'name': 'John Doe PLC',
                  'shares_currency': 'USD',
                  'shares_percent': 41.12,
                  'citizenship': 'TZ'

                }
              ],
              'share_capital_currency': 'TZS',
              'share_capital_value': 200000000,
              'status': 'active'
            },
            'status': 'active',
            'createdAt': '2021-01-23 11:50',
            '_links': {
              'self': {
                'href': 'http://localhost:8080/licences/1'
              },
              'employees': {
                'href': 'http://localhost:8080/licences'
              }
            }
          },
          {
            'id': 4,
            'licenseGroupName': 'Individual License',
            'licenceName': 'Network Facility License',
            'services': [
              {
                'licenseGroupName': 'Individual License',
                'licenceName': 'Network Facility License',
                'serviceName': 'Cabling',
                'serviceLevel': 'International',
                'serviceCoverage': []
              },
              {
                'licenseGroupName': 'Individual License',
                'licenceName': 'Network Facility License',
                'serviceName': 'NetworkService',
                'serviceLevel': 'District',
                'serviceCoverage': ['ARS', 'MWZ', 'DAR']
              }
            ],
            'nature_of_services': '',
            'coverage': '',
            'estimationCost': 110000,
            'commencementDate': '2021-01-23 11:50',
            'futurePlans': '',
            'anyOtherRelevantInfo': '',
            'attachments': [
              {
                'id': 1,
                'name': 'Network Diagram',
                'uri': 'attachments/12/network.diagram.pdf',
                'description': 'The network diagram',
                'createdAt': '2021-01-23 11:50',
                'status': 'active',
                'attachmentType': {
                  'name': 'Network Diagram',
                  'isPrimary': true,
                  'createdAt': '2021-01-23 11:50'
                }
              },
              {
                'id': 2,
                'name': 'Service Pricing',
                'uri': 'attachments/12/service.pricing.pdf',
                'description': 'The Service diagram',
                'createdAt': '2021-01-23 11:50',
                'status': 'active',
                'attachmentType': {
                  'name': 'IndividualLicense',
                  'isPrimary': true,
                  'createdAt': '2021-01-23 11:50'
                }
              }],
            'applicant': {
              'applicantType': 'Company',
              'name': 'Vodacom Tanzania PLC',
              'telephone': '270123456789',
              'fax': '270123456789',
              'email': 'compliance@vodacom.co.tz',
              'website': 'vodacom.co.tz',
              'representative': {
                'firstName': '',
                'middleName': '',
                'lastName': '',
                'email': '',
                'phone': '',
                'gender': '',
                'geolocations': {
                  'region': 'DAR',
                  'district': 'KINONDONI',
                  'addressType': '',
                  'postalCode': '',
                  'postalAddress': ''
                }
              },
              'addresses': [
                {
                  'city': 'Dar es salaam',
                  'street': 'Mwai Kibaki Road',
                  'Plot No': ''
                }],
              'shareholders': [
                {
                  'name': 'John Done PLC',
                  'shares_percent': 12.12,
                  'citizenship': 'TZ'
                },
                {
                  'name': 'John Doe PLC',
                  'shares_currency': 'USD',
                  'shares_percent': 41.12,
                  'citizenship': 'TZ'

                }
              ],
              'share_capital_currency': 'TZS',
              'share_capital_value': 200000000,
              'status': 'active'
            },
            'status': 'rejected',
            'createdAt': '2021-01-23 11:50',
            '_links': {
              'self': {
                'href': 'http://localhost:8080/licences/1'
              },
              'employees': {
                'href': 'http://localhost:8080/licences'
              }
            }
          },
          {
            'id': 5,
            'licenseGroupName': 'Individual License',
            'licenceName': 'Network Facility License',
            'services': [
              {
                'licenseGroupName': 'Individual License',
                'licenceName': 'Network Facility License',
                'serviceName': 'Cabling',
                'serviceLevel': 'International',
                'serviceCoverage': []
              },
              {
                'licenseGroupName': 'Individual License',
                'licenceName': 'Network Facility License',
                'serviceName': 'NetworkService',
                'serviceLevel': 'District',
                'serviceCoverage': ['ARS', 'MWZ', 'DAR']
              }
            ],
            'nature_of_services': '',
            'coverage': '',
            'estimationCost': 110000,
            'commencementDate': '2021-01-23 11:50',
            'futurePlans': '',
            'anyOtherRelevantInfo': '',
            'attachments': [
              {
                'id': 1,
                'name': 'Network Diagram',
                'uri': 'attachments/12/network.diagram.pdf',
                'description': 'The network diagram',
                'createdAt': '2021-01-23 11:50',
                'status': 'active',
                'attachmentType': {
                  'name': 'Network Diagram',
                  'isPrimary': true,
                  'createdAt': '2021-01-23 11:50'
                }
              },
              {
                'id': 2,
                'name': 'Service Pricing',
                'uri': 'attachments/12/service.pricing.pdf',
                'description': 'The Service diagram',
                'createdAt': '2021-01-23 11:50',
                'status': 'active',
                'attachmentType': {
                  'name': 'IndividualLicense',
                  'isPrimary': true,
                  'createdAt': '2021-01-23 11:50'
                }
              }],
            'applicant': {
              'applicantType': 'Company',
              'name': 'Vodacom Tanzania PLC',
              'telephone': '270123456789',
              'fax': '270123456789',
              'email': 'compliance@vodacom.co.tz',
              'website': 'vodacom.co.tz',
              'representative': {
                'firstName': '',
                'middleName': '',
                'lastName': '',
                'email': '',
                'phone': '',
                'gender': '',
                'geolocations': {
                  'region': 'DAR',
                  'district': 'KINONDONI',
                  'addressType': '',
                  'postalCode': '',
                  'postalAddress': ''
                }
              },
              'addresses': [
                {
                  'city': 'Dar es salaam',
                  'street': 'Mwai Kibaki Road',
                  'Plot No': ''
                }],
              'shareholders': [
                {
                  'name': 'John Done PLC',
                  'shares_percent': 12.12,
                  'citizenship': 'TZ'
                },
                {
                  'name': 'John Doe PLC',
                  'shares_currency': 'USD',
                  'shares_percent': 41.12,
                  'citizenship': 'TZ'

                }
              ],
              'share_capital_currency': 'TZS',
              'share_capital_value': 200000000,
              'status': 'active'
            },
            'status': 'active',
            'createdAt': '2021-01-23 11:50',
            '_links': {
              'self': {
                'href': 'http://localhost:8080/licences/1'
              },
              'employees': {
                'href': 'http://localhost:8080/licences'
              }
            }
          }
        ],
        'data': {}
      }
    }
  }
]
