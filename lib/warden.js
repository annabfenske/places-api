
const fetchWarden = async (token, res) => {
  let warden = {}

  warden.user = {
    id: null,
    email: null,
    first_name: null,
    last_name: null
  }

  warden.isAuthenticated = () => {
    if (!warden.user.id) {
      return false
    } else {
      return true
    }
  }

  // TODO: implement fetchWarden

  return warden
}


export default fetchWarden
