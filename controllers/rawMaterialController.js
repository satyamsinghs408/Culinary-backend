const RawMaterial = require('../models/RawMaterial');

// @desc    Get all raw materials
// @route   GET /api/raw-materials
exports.getRawMaterials = async (req, res) => {
  try {
    const materials = await RawMaterial.find().sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new raw material
// @route   POST /api/raw-materials
exports.createRawMaterial = async (req, res) => {
  try {
    const { name, uom, opening, minLevel } = req.body;

    // Check availability
    const existing = await RawMaterial.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Material with this name already exists' });
    }

    const newMaterial = new RawMaterial({
      name,
      uom,
      stock: {
        opening: opening || 0,
        minLevel: minLevel || 0
      }
    });

    const savedMaterial = await newMaterial.save();
    res.status(201).json(savedMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update raw material
// @route   PUT /api/raw-materials/:id
exports.updateRawMaterial = async (req, res) => {
  try {
    const { name, uom, opening, minLevel } = req.body;
    
    // Find item first to preserve other stock fields
    const material = await RawMaterial.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Raw Material not found' });
    }

    material.name = name || material.name;
    material.uom = uom || material.uom;
    
    if (opening !== undefined) material.stock.opening = opening;
    if (minLevel !== undefined) material.stock.minLevel = minLevel;

    const updatedMaterial = await material.save();
    res.status(200).json(updatedMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete raw material (Optional usage)
// @route   DELETE /api/raw-materials/:id
exports.deleteRawMaterial = async (req, res) => {
  try {
    const material = await RawMaterial.findById(req.params.id);
    if (!material) {
        return res.status(404).json({ message: 'Material not found' });
    }
    
    await material.deleteOne();
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
