import bcrypt from 'bcrypt'
import { verifyToken, getToken } from './jwt'
import { getUserByEmail } from '../db/users'

export const verifyPassword = (password, userPassword) => {
  if (!password || !password) return false
  return bcrypt.compare(password, userPassword)
}

export const nomNom = res => {
  res.cookie('token', '', { httpOnly: true, expires: new Date() })
  res.set('Access-Control-Expose-Headers', 'logout')
  res.setHeader('logout', true)
}

export const authenticate = async (email, password, warden, context) => {
  try {
    let { password: userPassword, ...user } = await getUserByEmail(email, [
      'id',
      'email',
      'first_name',
      'last_name',
      'password'
    ])

    let passwordMatch = await verifyPassword(password, userPassword)

    if (!passwordMatch) {
      return {}
    }

    warden.setUser(user)

    const token = getToken(user.id, process.env.JWT_SECRET)

    const expires = new Date()
    expires.setDate(expires.getDate() + 1)

    res.set('token', token)

    return {
      token,
      user
    }

  } catch (err) {
    return {}
  }
}
