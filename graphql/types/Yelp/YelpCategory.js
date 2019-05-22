import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from 'graphql'

export default new GraphQLObjectType({
  name: 'YelpCategory',
  description: 'Category describing a business returned by Yelp Fusion API',
  fields: _ => ({
    alias: {
      description: 'Alias of the type for api usage',
      type: new GraphQLNonNull(GraphQLString)
    },
    title: {
      description: 'Displayable name for the category',
      type: new GraphQLNonNull(GraphQLString)
    }
  }) 
})