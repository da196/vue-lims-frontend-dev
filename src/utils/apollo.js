import { ApolloClient } from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { getToken } from '@/utils/auth'
import Vue from 'vue'
import store from '@/store'

import VueApollo from 'vue-apollo'

const link = createHttpLink({
  // You should use an absolute URL here
  uri: process.env.GRAPHQL_URI || 'http://localhost:1234/graphql-api',
  headers: {
    authorization: `Bearer ${getToken()}`
  }
})

const apolloClient = new ApolloClient({
  store,
  link,
  cache: new InMemoryCache(),
  name: 'LIMS link'
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.use(VueApollo)

export default apolloProvider
