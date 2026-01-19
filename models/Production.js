const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD format as used in frontend
    required: true
  },
  fgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FinishedGood',
    required: true
  },
  fgName: { // Caching name to avoid heavy joins for simple lists
    type: String,
    required: true
  },
  quantity: { // Planned Quantity
    type: Number,
    required: true
  },
  issuedQty: { // Actual Processed/Issued Quantity
    type: Number,
    default: 0
  },
  allocatedQty: { // Initially equals planned quantity
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Allocated', 'Partial', 'Completed'],
    default: 'Allocated'
  },
  // Snapshot of BOM at the time of planning (in case recipe changes later)
  bomSnapshot: [{
    rmId: { type: mongoose.Schema.Types.ObjectId, ref: 'RawMaterial' },
    qty: Number, // Qty per unit
    uom: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Production', productionSchema);
