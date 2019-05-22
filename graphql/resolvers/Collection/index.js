import places from './places'

export const linked_Collection = (yelpSchema, transforms) => ({
  places: places(yelpSchema, transforms)
})