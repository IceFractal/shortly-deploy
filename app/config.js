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
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var ObjectId = mongoose.Schema.Types.ObjectId;

var db = {};

db.urls = new Schema({
  // id: Number,
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
});

db.urls.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

db.users = new Schema({
  // id: Number,
  username: String,
  password: String,
  createdAt: {type: Date, default: Date.now}
});

var cipher = Promise.promisify(bcrypt.hash);

db.users.pre('save', function(next) {
  cipher(this.password, null, null).bind(this).then(
    function(hash) {
      this.password = hash;
      next();
    });
});

db.users.methods.compare = function(attempt, cb) {
  // cb(this.password === attempt);
  // cb();
  bcrypt.compare(attempt, this.password, function(err, isMatch) {
    cb(isMatch);
  });
};

// comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }

db.url = mongoose.model('urls', db.urls);
db.user = mongoose.model('users', db.users);

mongoose.connect('mongodb://localhost');

module.exports = db;

