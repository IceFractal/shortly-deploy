var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = {};

db.urls = new Schema({
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
  bcrypt.compare(attempt, this.password, function(err, isMatch) {
    cb(isMatch);
  });
};

db.url = mongoose.model('urls', db.urls);
db.user = mongoose.model('users', db.users);

mongoose.connect('mongodb://localhost');

module.exports = db;

