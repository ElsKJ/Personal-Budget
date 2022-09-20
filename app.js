const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const router = require('./Routers/envelopesRouter.js');
const envelopesRouter = require('./Routers/envelopesRouter.js');
const app = express();
const pool = require('./db-config')
const { findEnvelopeById } = require('./db');


app.use(morgan('dev'));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

envelopesRouter.param('id', async (req, res, next, id) => {
    try {
        
        id = Number(id);
        const envelope = await findEnvelopeById(id);

        req.envelope = envelope;
        next()
        
    } catch (error) {
        res.status(404).send('Envelope not found')
    }
})

app.use('/envelopes', envelopesRouter)

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});