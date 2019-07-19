
export default `
  type Query {
    # The current authenticated user
    viewer: AppUser
    # Query for a specific collection by its id
    collection(
      # The ID for the collection you want to load
      id: String!
    ): Collection
    # Query for a list of collections
    collections(
      # Specify a user id to list all collections belonging to that user
      user_id: String
      # Specify a business id to list all collections containing that business
      business_id: String
      # The max number of results to return in a single query
      limit: Int
      # The number of results to skip
      offset: Int
    ): [Collection]
    # List all available icons
    icons: [Icon]
    # Query for a specific icon by its id
    icon(
      # The ID for the icon you want to load
      id: String!
    ): Icon
    # List all available colors
    colors: [Color]
    # Query for a specific color by its id
    color(
      # The ID of the color you want to load
      id: String!
    ): Color
  }
`