const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    // Set by server
    flightNumber: { type: Number, required: true }, 
    customers: [ String ],
    upcoming: { type: Boolean, required: true },
    success: { type: Boolean, required: true, default: true },

    // Provided by client
    mission: { type: String, required: true }, 
    rocket: { type: String, required: true }, 
    launchDate: { type: Date, required: true },
    target: { type: String, required: true }, 
});

// Connects launchesSchema with the "launches" collection
module.exports = mongoose.model('Launch', launchesSchema);

