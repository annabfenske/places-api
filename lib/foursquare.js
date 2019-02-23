import fetch from 'node-fetch'
import qs from 'qs'

export const FOURSQUARE_CATEGORIES = Object.freeze({
  NIGHTLIFE: '4d4b7105d754a06376d81259',
  FOOD: '4d4b7105d754a06374d81259'
})

export const foursquareFetch = async (endpoint, config = {}) => {
  let { query, ...restOfConfig } = config 
  let queryVals = {
    ...(query || {}),
    client_id: process.env.FOURSQUARE_CLIENT_ID,
    client_secret: process.env.FOURSQUARE_CLIENT_SECRET,
    v: process.env.FOURSQUARE_API_VERSION
  }

  let result = await fetch(`${process.env.FOURSQUARE_API_URL}${endpoint}?${qs.stringify(queryVals)}`, {
    method: 'GET',
    ...restOfConfig
  })
  .then(res => res.json())

  if (result.meta.code !== 200) {
    console.log(`Error fetching ${process.env.FOURSQUARE_API_URL}${endpoint}: `, JSON.stringify(result, null, 2))
    throw new Error(result.meta.errorType)
  }

  return result.response
}