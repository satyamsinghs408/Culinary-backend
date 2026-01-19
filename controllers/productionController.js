const Production = require('../models/Production');
const RawMaterial = require('../models/RawMaterial');
const Transaction = require('../models/Transaction');

// @desc    Plan Production (Allocate Stock)
// @route   POST /api/production/plan
exports.planProduction = async (req, res) => {
  try {
    // bomSnapshot expects: [{ rmId, qty, uom }]
    const { date, fgId, fgName, quantity, bomSnapshot } = req.body;

    // 1. Create Production Batch
    const batch = new Production({
      date,
      fgId,
      fgName,
      quantity,
      allocatedQty: quantity,
      status: 'Allocated',
      bomSnapshot
    });
    await batch.save();

    // 2. Allocate Stock for each ingredient
    // We loop through BOM and increment 'stock.allocated'
    const updatePromises = bomSnapshot.map(item => {
      const requiredQty = item.qty * Number(quantity);
      return RawMaterial.findByIdAndUpdate(item.rmId, {
        $inc: { 'stock.allocated': requiredQty }
      });
    });
    await Promise.all(updatePromises);

    res.status(201).json(batch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Issue against Batch (Partial/Complete)
// @route   POST /api/production/:id/issue
exports.issueBatch = async (req, res) => {
  try {
    const { issueQty, date } = req.body; // Qty of FG being produced/issued
    const batchId = req.params.id;

    const batch = await Production.findById(batchId);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    const currentIssueQty = Number(issueQty);
    
    // 1. Update Batch Status
    const newIssuedTotal = batch.issuedQty + currentIssueQty;
    batch.issuedQty = newIssuedTotal;
    if (newIssuedTotal >= batch.quantity) {
      batch.status = 'Completed';
    } else {
      batch.status = 'Partial';
    }
    await batch.save();

    // 2. Process Stock & Transactions for each ingredient
    // Strategy:
    // - DECREASE Allocated (Release reservation)
    // - INCREASE Issued (Actual consumption)
    // - LOG Transaction (Issuance)
    
    // Use for loop to handle async operations sequentially or Promise.all
    const stockPromises = batch.bomSnapshot.map(async (item) => {
        const consumedQty = item.qty * currentIssueQty;
        
        // Update Stock
        await RawMaterial.findByIdAndUpdate(item.rmId, {
            $inc: { 
                'stock.allocated': -consumedQty, // Release allocation
                'stock.issued': consumedQty      // Increase usage
            }
        });

        // Create Issuance Transaction Log
        await Transaction.create({
            type: 'ISSUANCE',
            date: date || new Date().toISOString().split('T')[0],
            itemId: item.rmId,
            quantity: consumedQty,
            issuedTo: `Batch #${batchId.toString().slice(-6)} (${batch.fgName})`
        });
    });

    await Promise.all(stockPromises);

    res.status(200).json(batch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get Production History
// @route   GET /api/production
exports.getProductionHistory = async (req, res) => {
  try {
    const history = await Production.find().sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
