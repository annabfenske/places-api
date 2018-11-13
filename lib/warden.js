import { nomNom } from './auth'
export const fetchWarden = async (token, res) => {

  // TODO: create warden
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

export default class Warden {
  constructor(res) {
    this.user = {
      id: null,
      email: null,
      first_name: null,
      last_name: null
    }

    this.res = res
  }

  isAuthenticated = () => {
    if (!this.user.id && this.res) {
      nomNom(this.res)
      return false
    } else if (!this.user.id) {
      return false
    }

    return true
  }

  setUser = (user) => {
    if (user) {
      this.user = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    }
  }
}
