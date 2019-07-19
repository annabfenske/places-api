import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import cookieParser from 'cookie-parser'

import { makeSchema } from './graphql/schema'
import { fetchWarden } from './lib/warden'

const startServer = async () => {
  try {
    let schema = await makeSchema()
    
    const app = express()
    const PORT = process.env.PORT || 3000
    app.use('/graphql', cookieParser())

    const apollo = new ApolloServer({
      schema,
      tracing: true,
      context: async ({ req, res }) => {
        const token = req.headers.places_token || req.cookies.places_token
        const warden = await fetchWarden(token, res)

        return {
          warden,
          req,
          res,
          token
        }
      },
      playground: process.env.NODE_ENV === 'production'
        ? false
        : {
          settings: {
            'request.credentials': 'include'
          }
        }
    })

    apollo.applyMiddleware({ app })

    app.listen(PORT, () => {
      console.log(`pages-api is now running on http://localhost:${PORT}`)
    })

  } catch (err) {
    console.error(err)
    process.exit(0)
  }
}

startServer()