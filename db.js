const {checkHigherId, discountMoney} = require('./helpers/eH')
const pool = require('./db-config');

// envelopes table code
const getAllEnvelopes = async() => {
    const envelopes = await pool.query('SELECT * FROM envelopes');
    
    return envelopes.rows;
}

const findEnvelopeById = async(id) => {
    const value = [id];

    const response = await pool.query('SELECT * FROM envelopes WHERE id = $1', value);

        if(response.rows.length <= 0){
            throw new Error('Envelope not found');
        }

    return response.rows;
}

const addEnvelope = async({category, balance}) => {
    try {

        let id = await checkHigherId();
        id = (id[0].max) + 1;
        const values = [id, category, balance];
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

//transactions table code

const AddTransaction = async ({paymentAmount, envelopeId, recipient}) => {
    try {
        let id = await checkHigherId("transactions");
        console.log(id);
        id = id[0].max + 1;
        await discountMoney(findEnvelopeById, updateEnvelopeById, envelopeId, paymentAmount);
        const values = [id, recipient, paymentAmount, envelopeId];
        await pool.query('INSERT INTO transactions(id, recipient, payment_amount, envelope_id) VALUES($1, $2, $3, $4)', values);
        
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAllTransactions = async () => {
    try {
        const response = await pool.query('SELECT * FROM transactions');
        return response.rows
    } catch (error) {

        throw new Error(error.message);
    }
}

const findTransactionById = async id => {
    try {
        const value = [id]
        const response = await pool.query('SELECT * FROM transactions WHERE id = $1', value)
        if(response.rows.length > 0){
            return response.rows;

        }
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
    throw new Error('Transaction not found');
}

const updateTransactionById = async(id, {envelopeId, paymentAmount, recipient}) => {
    try {
        values = [ id, recipient, paymentAmount, envelopeId]
        const transaction = await findTransactionById(id);
        const envId = transaction[0].envelope_id;
        console.log(envId);
        //if the user change the envelope then the money which used to be in the old envelope have to came back to it
        if(envId !== envelopeId){

            await discountMoney(findEnvelopeById, updateEnvelopeById, envelopeId, paymentAmount);
            const envelope = await findEnvelopeById(envId);
            let balance = Number(envelope[0].balance);
            console.log(`balance: ${balance}`);
            const payAmount = Number(transaction[0].payment_amount);
            balance = balance + payAmount;     
            console.log(`nuevo balance: ${balance}`);
            const data = {
                category: envelope[0].category,
                balance: balance
            }
            updateEnvelopeById(envId, data);

        }

        await pool.query('UPDATE transactions SET envelope_id = $4, payment_amount = $3, recipient = $2 WHERE id = $1', values);
        
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteTransactionById = async (id) => {
    try {
        const value = [id];
        const response = await pool.query('DELETE FROM transactions WHERE id = $1', value);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getAllEnvelopes,
    findEnvelopeById,
    addEnvelope,
    deleteEnvelopeById,
    updateEnvelopeById,
    AddTransaction,
    getAllTransactions,
    findTransactionById,
    updateTransactionById,
    deleteTransactionById
}
