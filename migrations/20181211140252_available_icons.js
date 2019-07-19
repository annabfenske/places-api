const icons = [
  'local-bar',
  'local-dining',
  'local-cafe',
  'local-pizza',
  'local-mall',
  'local-movies',
  'local-play',
  'local-convenience-store',
  'local-see',
  'local-drink',
  'school',
  'fitness-center',
  'business-center',
  'home',
  'local-grocery-store',
  'local-pharmacy',
  'local-library',
  'local-hotel',
  'local-florist',
  'terrain',
  'golf-course',
  'cake',
  'person',
  'people',
  'pets',
  'directions-bus',
  'directions-car',
  'train',
  'flight',
  'directions-bike',
  'directions-run',
  'directions-walk',
  'accessible',
  'pool',
  'motorcycle',
  'wc',
  'wifi',
  'local-atm',
  'local-offer',
  'weekend',
  'beach-access',
  'casino',
  'child-friendly',
  'watch-later',
  'headset',
  'videogame-asset',
  'palette',
  'star',
  'music-note',
  'sentiment-satisfied',
  'extension',
  'favorite',
  'event-seat',
  'watch',
  'brush'
]

const colors = [
  { name: 'red', hex: '#F44336' },
  { name: 'pink', hex: '#E91E63' },
  { name: 'purple', hex: '#9C27B0' },
  { name: 'deepPurple', hex: '#673AB7' },
  { name: 'indigo', hex: '#3F51B5' },
  { name: 'blue', hex: '#2196F3' },
  { name: 'cyan', hex: '#00BCD4' },
  { name: 'teal', hex: '#009688' },
  { name: 'green', hex: '#4CAF50' },
  { name: 'lightGreen', hex: '#8BC34A' },
  { name: 'lime', hex: '#CDDC39' },
  { name: 'yellow', hex: '#FFEB3B' },
  { name: 'amber', hex: '#FFC107' },
  { name: 'orange', hex: '#FF9800' },
  { name: 'deepOrange', hex: '#FF5722' },
  { name: 'brown', hex: '#795548' },
  { name: 'grey', hex: '#9E9E9E' },
  { name: 'blueGrey', hex: '#607D8B' }
]

exports.up = function(knex, Promise) {
  return knex.schema.createTable('icons', function(table) {
    table
      .uuid('id')
      .defaultTo(knex.raw('uuid_generate_v4()'))
      .primary()
    table
      .string('name')
      .notNull()
    table
      .string('type')
      .notNull()

    table.unique(['name', 'type'])
  })
    .then(() => knex.schema.createTable('colors', function(table) {
      table
        .uuid('id')
        .defaultTo(knex.raw('uuid_generate_v4()'))
        .primary()
      table
        .string('name')
        .notNull()
      table
        .string('hex')
        .notNull()

      table.unique('name')
      table.unique('hex')
    }))
    .then(() => knex('colors').insert(colors))
    .then(() => {
      let insertIcons = icons.map(name => ({ name, type: 'material' }))
      return knex('icons').insert(insertIcons)
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('icons')
    .then(() => knex.schema.dropTable('colors'))
};
