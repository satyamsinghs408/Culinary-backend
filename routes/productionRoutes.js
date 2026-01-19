const express = require('express');
const router = express.Router();
const { 
    planProduction, 
    issueBatch, 
    getProductionHistory 
} = require('../controllers/productionController');

router.post('/plan', planProduction);
router.post('/:id/issue', issueBatch);
router.get('/', getProductionHistory);

module.exports = router;
