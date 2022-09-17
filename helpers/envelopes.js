const isEnvelopeTrue = envelope => {
    try {
        const envelopeId = findEnvelopeById(envelope.id);
        return false;
    } catch (error) {
        return true;
    }

};

module.exports = {
    isEnvelopeTrue
}