export default `
  type AuthResponse {
    success: Boolean!
    message: String!
    user: AppUser
    token: String
  }

  type CollectionResponse {
    success: Boolean!
    message: String
    collection: Collection
  }
`