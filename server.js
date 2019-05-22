import express from 'express'
import { ApolloServer, graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { createServer } from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import { makeSchema } from './graphql/schema'
import { fetchWarden } from './lib/warden'

const app = express()
const PORT = process.env.PORT || 3000
app.use(cookieParser())

// const runServer = async _ => {
//   const schema = await makeSchema()
//   const server = new ApolloServer({
//     schema,
//     context: async ({ req, res }) => {
//       const token = req.headers.places_token || req.cookies.places_token
//       const warden = await fetchWarden(token, res)
      
//       return { res, req, token, warden }
//     }
//   })

//   server.applyMiddleware({ app })

//   app.listen({ port: PORT }, () => {
//     console.log(`pages-api is now running on http://localhost:${PORT}`)
//   })
// }

// runServer()


app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(async (req, res) => {
    const token = req.headers.places_token || req.cookies.places_token
    const warden = await fetchWarden(token, res)
    const schema = await makeSchema()

    // console.log('SCHEMA', schema)
    let options = {
      schema,
      rootValue: warden,
      context: { res, req, token, warden },
      tracing: true
    }
    return options
  })
)

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)

// const server = createServer(app)
app.listen(PORT, () => {
  console.log(`pages-api is now running on http://localhost:${PORT}`)
})
