const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;


// const link = `mongodb://localhost:27017/navidoo_app`;
const link = `mongodb://root:123456@ds249418.mlab.com:49418/realtime-with-socket`;

module.exports = function() {
  console.log('trying to connect to db')
  mongoose.connect(link)
  const User = require('./User');
}

