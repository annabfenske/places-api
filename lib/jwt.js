import jwt from 'jwt-simple'
import moment from 'moment'

export const getToken = (id, secret, exp = 8) => {
  const now = moment.utc()

  return jwt.encode(
    {
      exp: moment(now).add(exp, 'hours'),
      nbf: now,
      iat: now,
      id
    },
    secret
  )
}

export const verifyToken = (token, secret) => {
  if (!token) return false

  let decoded
  try {
    decoded = jwt.decode(token, secret)
  } catch (err) {
    return false
  }

  const now = moment.utc()
  const exp = moment.utc(decoded.exp)
  const nbf = moment.utc(decoded.nbf)

  if (
    now.isBefore(exp) &&
    now.isSameOrAfter(nbf)
  ) {
    return decoded
  }

  return false
}
