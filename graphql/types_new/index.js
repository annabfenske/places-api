/* Root Types */
import Query from './Query'
import Mutation from './Mutation'

/* Object Types */
import Viewer from './Viewer'
import Collection, { Extended_Collection } from './Collection'

/* Helper Types */
import AuthResponse from './AuthResponse'
import Icon from './Icon'
import Color from './Color'

/* Extended types from Yelp schema */
import yelpExtensions from './Yelp'

export default [
  /* Root Types */
  Query,
  Mutation,
  /* Object Types */
  Viewer,
  Collection,
  /* Helper Types */
  AuthResponse,
  Icon,
  Color
]

const extendedTypes = [
  Extended_Collection
]

export const linkTypeDefs = `
  ${yelpExtensions.join('\n')}
  ${extendedTypes.join('\n')}
`