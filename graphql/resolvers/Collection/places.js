import { gql } from 'apollo-server-express'

export default (yelpSchema, transforms) => ({
  fragment: gql`... on Collection { id }`,
  resolve: (collection, args, context, info) => {
    console.log(info.mergeInfo)
    return info.mergeInfo.delegateToSchema({
      schema: yelpSchema,
      operation: 'query',
      fieldName: 'search',
      args,
      context,
      info,
      transforms
    })
  }
})