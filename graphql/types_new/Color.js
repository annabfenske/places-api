import { gql } from 'apollo-server-express'

export default `
  type Color {
    id: String!
    name: String!
    hex: String!
  }
`