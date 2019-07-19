export default (parent, args, context, info) => {
  return info.mergeInfo.delegate(
    'query',
    'collections',
    {
      ...args,
      business_id: parent.id
    },
    context,
    info
  )
}