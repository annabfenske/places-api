import { gql } from 'apollo-server-express'

export default `
  type Query {
    # CURRENT USER
    viewer: Viewer

    # HELPERS
    icons: [Icon]
    icon(id: String!): Icon
    colors: [Color]
    color(id: String!): Color
  }
`