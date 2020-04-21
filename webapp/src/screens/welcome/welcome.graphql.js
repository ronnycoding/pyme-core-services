import gql from 'graphql-tag'

export const getWelcomeDataQuery = gql`
  query getWelcomeData {
    users {
      email
    }
  }
`
