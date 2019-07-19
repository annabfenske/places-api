export default `
  extend type Business {
    cached: Boolean
    added: Boolean!
    collections(
      limit: Int
      offset: Int
    ): [Collection]
  }
`