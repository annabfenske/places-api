export const isValidLocation = (location) => {
  return (
    location.lng >= -180 &&
    location.lng <= 180 &&
    location.lat >= -90 &&
    location.lat <= 90
  )
}
