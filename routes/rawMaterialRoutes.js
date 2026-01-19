const express = require('express');
const router = express.Router();
const { 
    getRawMaterials, 
    createRawMaterial, 
    updateRawMaterial, 
    deleteRawMaterial 
} = require('../controllers/rawMaterialController');

router.get('/', getRawMaterials);
router.post('/', createRawMaterial);
router.put('/:id', updateRawMaterial);
router.delete('/:id', deleteRawMaterial);

module.exports = router;
