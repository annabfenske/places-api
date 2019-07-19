import fetch from 'node-fetch'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import {
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  mergeSchemas,
  introspectSchema
} from 'graphql-tools'

import types, { linkTypeDefs } from './types'
import resolvers from './resolvers'

const getYelpSchema = async () => {
  const http = new HttpLink({ uri: process.env.YELP_API_URL + '/graphql', fetch })

  const link = setContext((request, previousContext) => {
    if (
      request.operationName === 'IntrospectionQuery' ||
      (
        previousContext.graphqlContext && 
        previousContext.graphqlContext.warden &&
        previousContext.graphqlContext.warden.isAuthenticated()
      )
    ) {
      return {
        headers: {
          'Authorization': `Bearer ${process.env.YELP_API_KEY}`
        }
      }
    }
    return {}
  }).concat(http)

  const schema = await introspectSchema(link)
  const remoteSchema = makeRemoteExecutableSchema({ schema, link })

  return remoteSchema
}

export const makeSchema = async () => {
  let yelpSchema = await getYelpSchema()

  const ourSchema = makeExecutableSchema({
    typeDefs: [
      `
        schema {
          query: Query
          mutation: Mutation
        }
      `,
      ...types
    ]
  })

  return mergeSchemas({
    schemas: [
      yelpSchema,
      ourSchema,
      linkTypeDefs
    ],
    resolvers
  })
}
