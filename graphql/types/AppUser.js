export default `
  type AppUser {
    id: String!
    email: String
    first_name: String!
    last_name: String!
    collections(
      limit: Int
      offset: Int
    ): [Collection]
  }
`