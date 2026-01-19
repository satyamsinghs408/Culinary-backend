const FinishedGood = require('../models/FinishedGood');

// @desc    Get all finished goods
// @route   GET /api/finished-goods
exports.getFinishedGoods = async (req, res) => {
  try {
    // Populate BOM items with their names for easier display if needed
    const goods = await FinishedGood.find().sort({ createdAt: -1 });
    res.status(200).json(goods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new finished good
// @route   POST /api/finished-goods
exports.createFinishedGood = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    const existing = await FinishedGood.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Product with this name already exists' });
    }

    const newFG = new FinishedGood({
      name,
      category,
      price
    });

    const savedFG = await newFG.save();
    res.status(201).json(savedFG);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update finished good details
// @route   PUT /api/finished-goods/:id
exports.updateFinishedGood = async (req, res) => {
  try {
    const { name, category, price } = req.body;
    
    const updatedFG = await FinishedGood.findByIdAndUpdate(
      req.params.id,
      { name, category, price },
      { new: true } // Return updated document
    );

    if (!updatedFG) {
      return res.status(404).json({ message: 'Finished Good not found' });
    }

    res.status(200).json(updatedFG);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update BOM for a Finished Good
// @route   PUT /api/finished-goods/:id/bom
exports.updateBOM = async (req, res) => {
  try {
    // Expects array of { rmId, qty, uom }
    const { bom } = req.body; 

    const updatedFG = await FinishedGood.findByIdAndUpdate(
      req.params.id,
      { bom },
      { new: true }
    );

    if (!updatedFG) {
      return res.status(404).json({ message: 'Finished Good not found' });
    }

    res.status(200).json(updatedFG);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
