import knex from '../../../connectors/postgres'

const getSelectedFieldsFromInfo = (info) => {
  console.log('INFO: ', JSON.stringify(info.selectionSet, null, 2))

  return '*'
}

const color = (root, args, context, info) => {
  let selectedFields = getSelectedFieldsFromInfo(info)

  return knex('colors')
    .where('id', args.id)
    .first(selectedFields)
}

const colors = (root, args, context, info) => {
  let selectedFields = getSelectedFieldsFromInfo(info)

  return knex('colors')
    .select(selectedFields)
}

const icon = (root, args, context, info) => {
  let selectedFields = getSelectedFieldsFromInfo(info)

  return knex('icons')
    .where('id', args.id)
    .first(selectedFields)
}

const icons = (root, args, context, info) => {
  let selectedFields = getSelectedFieldsFromInfo(info)

  return knex('icons')
    .select(selectedFields)
}

export default {
  color,
  colors,
  icon,
  icons
}