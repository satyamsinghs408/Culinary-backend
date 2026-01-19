const express = require('express');
const router = express.Router();
const { 
    addInward, 
    addIssuance, 
    getTransactions 
} = require('../controllers/inventoryController');

router.post('/inward', addInward);
router.post('/issuance', addIssuance);
router.get('/transactions', getTransactions);

module.exports = router;
