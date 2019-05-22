import { gql } from 'apollo-server-express'

export default `
  type Mutation {
    # Create a new user in the db (sign up or admin creation)
    create_user(
      first_name: String!
      last_name: String!
      email: String!
      password: String!
      authenticate: Boolean!
    ): AuthResponse
    # Log in to the app
    login(
      email: String!
      password: String!
    ): AuthResponse
    # Remove the auth cookie from web interface
    logout: AuthResponse
    # Create a collection to store places in
    create_collection(
      name: String!
      icon_id: String!
      color_id: String!
    ): Viewer
    # Update an existing collection
    update_collection(
      id: String!
      name: String
      icon_id: String
      color_id: String
    ): Collection
    # Add a business to a collection
    create_place(
      id: String!
      collection_id: String!
    ): Viewer
  }
`