const mongoose = require('mongoose');

const rawMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  uom: {
    type: String,
    required: true,
    enum: ['kg', 'gram', 'ltr', 'pcs', 'box'] // Based on UI options
  },
  stock: {
    opening: { type: Number, default: 0 },
    minLevel: { type: Number, default: 0 },
    inward: { type: Number, default: 0 },
    issued: { type: Number, default: 0 },
    allocated: { type: Number, default: 0 },
    // Virtual getter for current stock could be added later: opening + inward - issued
  }
}, { timestamps: true });

module.exports = mongoose.model('RawMaterial', rawMaterialSchema);
