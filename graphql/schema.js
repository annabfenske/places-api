import { buildSchema } from 'graphql'

const rootSchema = `
  type Query {
    hello: String
  }
`

export default buildSchema(rootSchema)
