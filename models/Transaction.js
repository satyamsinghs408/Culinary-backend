const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['INWARD', 'ISSUANCE'],
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RawMaterial',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  
  // Inward specific fields
  supplier: String,
  invoiceNo: String,
  amount: Number,

  // Issuance specific fields
  issuedTo: String, // Person name or Batch Reference
  
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
