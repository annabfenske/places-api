export default (parent, args, context, info) => {
  if (
    context.warden && 
    context.warden.isAuthenticated() && 
    parent.id === context.warden.user.id
  ) {
    return parent.email
  }

  return null
}