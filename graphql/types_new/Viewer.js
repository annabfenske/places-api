import { gql } from 'apollo-server-express'

export default `
  type Viewer {
    id: String!
    email: String!
    first_name: String!
    last_name: String!
    collections: [Collection]
  }
`