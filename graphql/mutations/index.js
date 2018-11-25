import AuthMutations from './auth'
import UserCategoryMutations from './userCategories'
import UserPlaceMutations from './userPlaces'

export default {
  ...AuthMutations,
  ...UserCategoryMutations,
  ...UserPlaceMutations
}
