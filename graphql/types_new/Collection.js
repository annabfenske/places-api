import { gql } from 'apollo-server-express'

export default `
  type Collection {
    id: String!
    name: String!
    icon: Icon!
    color: Color!
  }
`

export const Extended_Collection = `
  extend type Collection {
    places: Businesses
  }
`