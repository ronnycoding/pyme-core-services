import gql from 'graphql-tag'

export const CREATE_USER_BY_EMAIL = gql`
  mutation createUser($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    createUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
      user {
        isActive
      }
    }
  }
`
