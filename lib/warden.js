import { nomNom } from './auth'
import { verifyToken } from './jwt'
import { getUserById } from '../db/users'

export const fetchWarden = async (token, res) => {
  const warden = new Warden(res)

  try {
    if (!token || token === 'null') {
      return warden
    }

    const decoded = await verifyToken(token, process.env.JWT_AUTH_SECRET)

    if (!decoded) {
      res && nomNom(res)
      return warden
    }

    let user = await getUserById(decoded.id, [
      'id',
      'email',
      'first_name',
      'last_name'
    ])

    if (!user) {
      res && nomNom(res)
      return warden
    }

    warden.setUser(user)
    return warden

  } catch (err) {
    console.log('fetchWarden error: ', err)
    return warden
  }
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
