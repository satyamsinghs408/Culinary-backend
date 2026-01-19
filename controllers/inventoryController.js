const Transaction = require('../models/Transaction');
const RawMaterial = require('../models/RawMaterial');

// @desc    Add Inward Entry (Purchase)
// @route   POST /api/inventory/inward
exports.addInward = async (req, res) => {
  try {
    const { date, itemId, quantity, supplier, invoiceNo, amount } = req.body;
    
    // 1. Create Transaction
    const transaction = new Transaction({
      type: 'INWARD',
      date,
      itemId,
      quantity,
      supplier,
      invoiceNo,
      amount
    });
    await transaction.save();

    // 2. Update Stock (Increment Inward)
    await RawMaterial.findByIdAndUpdate(itemId, {
      $inc: { 'stock.inward': Number(quantity) }
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add Issuance Entry (Direct Issue)
// @route   POST /api/inventory/issuance
exports.addIssuance = async (req, res) => {
  try {
    const { date, itemId, quantity, issuedTo, updateStock = true } = req.body;
    
    // 1. Create Transaction
    const transaction = new Transaction({
      type: 'ISSUANCE',
      date,
      itemId,
      quantity,
      issuedTo
    });
    await transaction.save();

    // 2. Update Stock (Increment Issued)
    // Sometimes we might not want to update stock if handled elsewhere (e.g. Batch logic)
    // But typically for direct API calls, we do.
    if (updateStock) {
        await RawMaterial.findByIdAndUpdate(itemId, {
            $inc: { 'stock.issued': Number(quantity) }
        });
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get All Transactions
// @route   GET /api/inventory/transactions
exports.getTransactions = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    
    const transactions = await Transaction.find(filter)
      .populate('itemId', 'name uom')
      .sort({ createdAt: -1 });
    
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
