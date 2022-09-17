const router = require('express').Router();
const {isEnvelopeTrue}  = require('../helpers/envelopes.js')

router.get('/', (req, res, next) => {
    const envelopes = getAllEnvelopes();
    res.status(200).json(envelopes);
})

router.get('/:id', (req, res, next) => {
    envelope = findEnvelopeById(req.id);
    res.status(200).json(envelope);
})

router.post('/', (req, res, next) => {
    const envelope = req.body;
    const value = isEnvelopeTrue(envelope);
    if(value){
        addEnvelope(envelope)
        res.status(201).send('envelope successfully created')
    } else {
        res.status(409).send('That envelope already exist')
    }
})

router.put('/:id', (req, res, next) => {
    updatedEnvelope = updateEnvelopeById(req.id);
    res.status(200).json(updatedEnvelope);
})

router.delete('/:id', (req, res, next) => {
    deletedEnvelope = deleteEnvelopeById(req.id);
    res.status(200).json(deletedEnvelope);
})

module.exports = router;