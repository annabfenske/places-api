import ViewerQueries from './viewer'
import PlacesQueries from './places'
import UtilsQueries from './utils'

export default {
  ...ViewerQueries,
  ...PlacesQueries,
  ...UtilsQueries
}
