import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { createServer } from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import schema from './graphql/schema'
import { fetchWarden } from './lib/warden'

const app = express()
const PORT = process.env.PORT || 3000
app.use(cookieParser())

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(async (req, res) => {
    const token = req.headers.token || req.cookies.token
    const warden = await fetchWarden(token, res)
    let options = {
      schema,
      rootValue: warden,
      context: { res, req, token, warden }
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

const server = createServer(app)
server.listen(PORT, () => {
  console.log(`pages-api is now running on http://localhost:${PORT}`)
})
