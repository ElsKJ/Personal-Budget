// this import makes the program crash 
// const { findEnvelopeById } = require('../db');


const pool = require('../db-config');

// had to change the code to work propertly withot crashing using func
// insted to directly use findEnvelopeById
const isEnvelopeTrue = async (envelope) => {
    if(Object.keys(envelope).length === 2 && envelope.category && envelope.balance){
        console.log('ok')
        return true
    }
    throw new Error('That envelope already exist or is not appropiate');
}

const checkHigherId = async() => {
    try {
        
        const response = await pool.query('SELECT MAX(id) FROM envelopes');
        return response.rows;
        
    } catch (err) {
        console.log(err);
    }

}

module.exports = {
    checkHigherId,
    isEnvelopeTrue
};