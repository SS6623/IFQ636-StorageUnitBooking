const mongoose = require('mongoose');

const storageUnitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    available: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.models.StorageUnit || mongoose.model('StorageUnit', storageUnitSchema);
