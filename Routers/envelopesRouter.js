const router = require('express').Router();
const {isEnvelopeTrue}  = require('../helpers/eH.js');
const db = require('../db');

router.get('/', async(req, res, next) => {
    try {
        const response = await db.getAllEnvelopes();
        res.status(200).json(response);
        
    } catch (error) {

        res.status(500).send('Server Error')
    }
})

router.get('/:id', (req, res, next) => {

    res.status(200).json(req.envelope);

})

router.post('/', async(req, res, next) => {
    try {
        const envelope = req.body;
        isEnvelopeTrue(envelope);
        await db.addEnvelope(envelope);
        res.status(201).send('envelope successfully created');
        
    } catch (error) {

        res.status(400).send(error.message)
        
    }
    
})

router.put('/:id', async(req, res, next) => {
    try {
        const body = req.body;
        isEnvelopeTrue(body)
        await db.updateEnvelopeById(req.envelope[0].id, body);
        res.status(200).send('Envelope successfuly updated');
        
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        await db.deleteEnvelopeById(req.envelope[0].id);
        res.status(200).send('Envelope successfuly deletede');
        
    } catch (error) {

        res.status(500).send(error.message)
    }
})

module.exports = router;