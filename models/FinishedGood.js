const mongoose = require('mongoose');

const bomItemSchema = new mongoose.Schema({
  rmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RawMaterial',
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  uom: {
    type: String,
    required: true
  }
}, { _id: false });

const finishedGoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    default: 'Sweets'
  },
  price: {
    type: Number,
    default: 0
  },
  bom: [bomItemSchema] // Array of ingredients required for 1 unit
}, { timestamps: true });

module.exports = mongoose.model('FinishedGood', finishedGoodSchema);
