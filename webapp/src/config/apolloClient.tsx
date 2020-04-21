// import { onError } from 'apollo-link-error'
// import { ApolloLink } from 'apollo-link'
// import { RetryLink } from 'apollo-link-retry'
import { setContext } from 'apollo-link-context'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import envConfig from './env'

const { coreApi } = envConfig

const authLink = setContext((_, { headers }) => {
  // const csrftoken = localStorage.getItem('csrftoken')
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      // 'HTTP_X_FORWARDED_HOST': 'web.consumopymecr.localhost',
      // 'HTTP_X_CSRFTOKEN': csrftoken,
      // authorization: token ? `Bearer ${token}` : "",
    },
  }
})

// Instantiate required constructor fields
const cache = new InMemoryCache()
const link = authLink.concat(new HttpLink({...coreApi, fetchOptions: {
  // credentials: 'include',
}}))

export default new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  link: link,
  // Provide some optional constructor fields
  name: 'react-web-client',
  version: '1.0',
  queryDeduplication: false,
  // defaultOptions: {
  //   watchQuery: {
  //     fetchPolicy: 'cache-and-network',
  //   },
  // },
})
