import joinMonster from 'join-monster'
import escape from 'pg-escape'
import Viewer from '../types/Viewer'

export default {
  viewer: {
    type: Viewer,
    where: (usersTable, args, warden) => {
      return escape(`${usersTable}.id = %L`, warden.user.id)
    },
    resolve: (warden, args, context, info) => {
      return joinMonster(info, warden, sql => knex.raw(sql))
    }
  }
}
