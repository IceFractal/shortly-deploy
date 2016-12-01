// var path = require('path');
// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });
// var db = require('bookshelf')(knex);

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// module.exports = db;
var crypto = require('crypto');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var ObjectId = mongoose.Schema.Types.ObjectId;

var db = {};

db.urls = new Schema({
  // id: Number,
  url: String,
  baseUrl: String,
  code: {type: String, default: function(model, attrs, options) {
    var shasum = crypto.createHash('sha1');
    return shasum.digest('hex').slice(0, 5);
  }},
  title: String,
  visits: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
});

db.users = new Schema({
  // id: Number,
  username: String,
  password: String,
  createdAt: {type: Date, default: Date.now}
});

db.url = mongoose.model('urls', db.urls);
db.user = mongoose.model('users', db.users);

mongoose.connect('mongodb://localhost');

module.exports = db;

