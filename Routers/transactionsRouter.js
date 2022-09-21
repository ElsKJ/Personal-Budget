const router = require('express').Router();
const {isTransactionTrue}  = require('../helpers/eH.js');
const db = require('../db');

router.get('/', async(req, res, next) => {
    try {
        const response = await db.getAllTransactions();
        res.status(200).json(response);
        
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/:id', async(req, res, next) => {
    res.status(200).json(req.transaction);
})

router.post('/', async(req, res, next) => {
    try {
        const transaction = req.body;
        isTransactionTrue(transaction);
        await db.AddTransaction(transaction);
        res.status(201).send('Transaction successfuly created');
        
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const transaction = req.body;
        isTransactionTrue(transaction);
        await db.updateTransactionById(req.transaction[0].id, transaction);
        res.status(200).send('transaction successfuly updated');
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        await db.deleteTransactionById(req.transiction[0].id);
        res.status(200).send('transiction successfully deleted');
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = router;