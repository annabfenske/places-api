import { gql } from 'apollo-server-express'

export default `
  extend type Business {
    added: Boolean!
    collections(
      limit: Int
      offset: Int
    ): [Collection]
  }
`