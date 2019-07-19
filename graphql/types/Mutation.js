import { gql } from "apollo-server-express"

export default `
  type Mutation {
    # Create a new user in the db (sign up or admin creation)
    create_user(
      # The user's first name
      first_name: String!
      # The user's last name
      last_name: String!
      # The user's email (cannot use an email belonging to another user in our db)
      email: String!
      # The user's password
      password: String!
      # Setting authenticate to true will log the new user in if they are successfully created.
      authenticate: Boolean!
    ): AuthResponse

    # Log in to the app
    login(
      # The user's email (case insensitive)
      email: String!
      # The user's password
      password: String!
    ): AuthResponse

    # Remove the auth cookie from web interface
    logout: AuthResponse

    # Create a collection
    create_collection(
      # The name of the new collection
      name: String!
      # The id of the icon that will represent this collection
      icon_id: String!
      # The color that will represent this collection
      color_id: String!
    ): CollectionResponse

    # Update an existing collection
    update_collection(
      # The ID of the collection you want to edit
      id: String!
      # (Optional) The new name of this collection
      name: String
      # (Optional) The ID of the new icon for this collection
      icon_id: String
      # (Optional) The ID of the new color for this collection
      color_id: String
    ): CollectionResponse

    # Add a business to a collection
    add_to_collection(
      # The ID of the business you'd like to add to the collection
      business_id: String!
      # The ID of the collection
      collection_id: String!
    ): CollectionResponse

    # Delete one or more businesses from a collection
    delete_from_collection(
      # The IDs of the businesses you'd like to remove from the collection
      business_ids: [String]!
      # The ID of the collection
      collection_id: String!
    ): CollectionResponse
  }
`