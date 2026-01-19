const express = require('express');
const router = express.Router();
const { 
    getFinishedGoods, 
    createFinishedGood, 
    updateFinishedGood, 
    updateBOM
} = require('../controllers/finishedGoodController');

router.get('/', getFinishedGoods);
router.post('/', createFinishedGood);
router.put('/:id', updateFinishedGood);
router.put('/:id/bom', updateBOM);

module.exports = router;
