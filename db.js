const some = require('./helpers/eH')
const pool = require('./db-config');


const getAllEnvelopes = async() => {
    const envelopes = await pool.query('SELECT * FROM envelopes');
    
    return envelopes.rows;
}

const findEnvelopeById = async(id) => {
    const value = [id];

    const response = await pool.query('SELECT * FROM envelopes WHERE id = $1', value);

        if(response.rows.length <= 0){
            console.log('envelope not found');
            throw new Error('Envelope not found');
        }

    return response.rows;
}

const addEnvelope = async({category, balance}) => {
    try {

        let id = await some.checkHigherId();
        id = (id[0].max) + 1;
        const values = [id, category, balance]
        const response = await pool.query('INSERT INTO envelopes VALUES($1, $2, $3)', values);
        
    } catch (err) {
        throw new Error('Imposible to add values into the database');
    }

}
const deleteEnvelopeById = async id => {
    try {
        const value = [id];
        const response = await pool.query('DELETE FROM envelopes WHERE id = $1', value);
    } catch (error) {
        throw new Error('Something went wrong');
    }
}

const updateEnvelopeById = async (id, {category, balance}) => {
    try {
        const values = [id, category, balance];
        const response = await pool.query('UPDATE envelopes SET category = $2, balance = $3 WHERE id = $1', values);
    } catch (error) {
        console.log(error)
        throw new Error('Something went wrong');
    }
}

module.exports = {
    getAllEnvelopes,
    findEnvelopeById,
    addEnvelope,
    deleteEnvelopeById,
    updateEnvelopeById
}
