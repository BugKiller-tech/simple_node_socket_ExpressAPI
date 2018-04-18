const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const schema = new mongoose.Schema({
  firstname: {
    type: Schema.Types.String,
    requried: true
  },
  lastname: {
    type: Schema.Types.String,
    required: true
  },
  phoneNumber: {
    type: Schema.Types.String,
    requried: true
  },
  lat: {
    type: Schema.Types.Number,
    requried: true
  },
  lng: {
    type: Schema.Types.Number,
    requried: true
  },
  order: {
    type: Schema.Types.Number,
    required: true
  },

  uniqueId: {
    type: Schema.Types.String,
    required: true
  }
})
const User = mongoose.model('User', schema);
module.exports = User;

