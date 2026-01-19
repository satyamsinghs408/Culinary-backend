const express = require('express');
const router = express.Router();
const { 
    addInward, 
    addIssuance, 
    getTransactions,
    deleteTransaction
} = require('../controllers/inventoryController');

router.post('/inward', addInward);
router.post('/issuance', addIssuance);
router.get('/transactions', getTransactions);
router.delete('/transaction/:id', deleteTransaction);

module.exports = router;
