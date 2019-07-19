/* AUTH */
import create_user from './create_user'
import login from './login'
import logout from './logout'

/* Collections */
import create_collection from './create_collection'
import update_collection from './update_collection'
import add_to_collection from './add_to_collection'

export default {
  /* AUTH */
  create_user,
  login,
  logout,
  /* Collections */
  create_collection,
  update_collection,
  add_to_collection
}