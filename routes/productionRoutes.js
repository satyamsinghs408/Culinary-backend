const express = require('express');
const router = express.Router();
const { 
    planProduction, 
    issueBatch, 
    getProductionHistory,
    cancelProduction
} = require('../controllers/productionController');

router.post('/plan', planProduction);
router.post('/:id/issue', issueBatch);
router.get('/', getProductionHistory);
router.delete('/:id', cancelProduction);

module.exports = router;
