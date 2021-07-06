const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/v1/authenticate',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // // mock error
      // if (!token) {
      //   return {
      //     code: 60204,
      //     message: 'Account and password are incorrect.'
      //   }
      // }
      //

      // return {
      //   code: 2000,
      //   data: { token: 'admin-token' }
      // }
      //
      return {
        'code': 2000,
        'status': true,
        'message': 'Authenticated',
        'data': {
          'id': 1,
          'fullname': 'Dev SuperAdmin',
          'email': 'dev@tcra.go.tz',
          'permissions': [
            'ROLE_USER_MANAGEMENT_VIEW',
            'ROLE_USER_EDIT',
            'ROLE_USER_VIEW_ALL',
            'ROLE_ATTACHMENTS_TYPE_VIEW',
            'ROLE_ENTITY_CATEGORY_VIEW',
            'ROLE_ENTITY_CATEGORY_ADD',
            'ROLE_ENTITY_CATEGORY_EDIT'
          ],
          'username': 'dev@tcra.go.tz',
          'token': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJST0xFIjoiQVBQTElDQU5UIiwic3ViIjoiZGV2QHRjcmEuZ28udHoiLCJleHAiOjE2MjEzNTMyMDksImlhdCI6MTYyMTMxNzIwOX0.138n_bq6NASCo5CYmSylW_NBZ44NJ1CeN89MIsM9zG0',
          'complete': true,
          'links': [
            {
              'rel': 'self',
              'href': 'http://10.200.222.72:8080/lims-api/v1/user/single/1'
            }
          ]
        },
        'dataList': []
      }
    }
  },

  // get user info
  {
    url: '/v1/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 2000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/v1/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 2000,
        data: 'success'
      }
    }
  },

  // user list
  {
    url: '/v1/users',
    type: 'get',
    response: config => {
      return {
        code: 2000,
        status: 'Okay',
        message: 'Okay',
        data: {
          total: 2,
          content: [
            {
              id: 1,
              firstname: 'Julius',
              middlename: 'Kambarage',
              lastname: 'Nyerere',
              approved: true,
              date_created: '1990-09-09 11:33',
              description: 'Lorem Ipsum',
              list_type: 'Currency',
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
