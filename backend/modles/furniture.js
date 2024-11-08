const mongoose = require('mongoose');

const FurnitureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    required: true
  },
  style: {
    type: String,
    required: true
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  price: {
    type: Number,
    required: true
  },
  colors: [{
    type: String
  }],
  materials: [{
    type: String
  }],
  images: [{
    type: String
  }],
  inStock: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Furniture', FurnitureSchema);