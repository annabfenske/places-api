import fetch from 'node-fetch'
import qs from 'qs'

export const yelpFetch = async (endpoint, config = {}) => {
  let { query, headers, ...restOfConfig } = config
  let result = await fetch(`${process.env.YELP_API_URL}${endpoint}?${qs.stringify(query)}`, {
    method: 'GET',
    ...restOfConfig,
    headers: {
      Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      ...headers
    }
  })

  if (result.ok) {
    return result.json()
  } else {
    throw new Error(result.statusText)
  }
}