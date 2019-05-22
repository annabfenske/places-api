import { gql } from 'apollo-server-express'

export default `
  type AuthResponse {
    success: Boolean!
    message: String!
    viewer: Viewer
    token: String
  }
`