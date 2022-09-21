// this import makes the program crash: 
// const { findEnvelopeById } = require('../db');

const pool = require('../db-config');

// had to change the code to work propertly withot crashing using func
// insted to directly use findEnvelopeById
const isEnvelopeTrue = (envelope) => {
    if(Object.keys(envelope).length === 2 && envelope.category && envelope.balance){
        return true
    }
    throw new Error('Something went wrong, check you have only the needed information');
}

const isTransactionTrue = (transaction) => {
    if(Object.keys(transaction).length === 3 && transaction.envelopeId && transaction.recipient && transaction.paymentAmount){
        return true
    }
    throw new Error('Something went wrong, check you have only the needed information');
}

const checkHigherId = async (table = 'envelope') => {
    try {
    
        if(table = 'transactions'){
            const response = await pool.query('SELECT MAX(id) FROM transactions');
            return response.rows;
        }
        const response = await pool.query('SELECT MAX(id) FROM envelopes');
        return response.rows;
        
    } catch (err) {
        console.log(err);
    }
}

const haveEnoughMoney = async (func, id, paymentAmount) => {
    try {
        const response = await func(id);
        const balance = response[0].balance;
        if(paymentAmount <= balance){
            return true;
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
    throw new Error('Not enough balance');
}

const discountMoney = async (func, func2, id, paymentAmount) => {
    try {
        const response = await func(id);
        const envelope = response[0];
        await haveEnoughMoney(func, id, paymentAmount);
        envelope.balance = envelope.balance - paymentAmount;
        await func2(id, envelope);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    checkHigherId,
    isEnvelopeTrue,
    isTransactionTrue,
    discountMoney
};