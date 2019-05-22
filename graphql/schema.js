import fetch from 'node-fetch'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import {
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  mergeSchemas,
  introspectSchema,
  transformSchema,
  RenameTypes
} from 'graphql-tools'
import { gql } from 'apollo-server-express'

import types, { linkTypeDefs } from './types_new'
import resolvers, { linkResolvers } from './resolvers'

const http = new HttpLink({ uri: process.env.YELP_API_URL + '/graphql', fetch })

const link = setContext((request, previousContext) => {
  console.log('PREV CONTEXT: ', previousContext)
  // if (previousContext.warden && previousContext.warden.isAuthenticated()) {
    return {
      headers: {
        'Authorization': `Bearer ${process.env.YELP_API_KEY}`
      }
    }
  // }
  // return {}
}).concat(http)

const getYelpSchema = async _ => {
  const schema = await introspectSchema(link)
  const yelpSchema = makeRemoteExecutableSchema({ schema, link })

  return yelpSchema

}

export const makeSchema = async _ => {
  const yelpSchema = await getYelpSchema()
  const ourSchema = makeExecutableSchema({
    typeDefs: [
      `
        schema {
          query: Query
          mutation: Mutation
        }
      `, 
      ...types
    ],
    resolvers
  })

  return mergeSchemas({
    schemas: [
      yelpSchema,
      ourSchema,
      linkTypeDefs
      // ...linkTypeDefs
    ],
    // resolvers: linkResolvers(yelpSchema)
  })
}
