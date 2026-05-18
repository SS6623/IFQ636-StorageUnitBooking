const mongoose = require('mongoose');

const storageUnitSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    size: {
        type: String,   // e.g. Small, Medium, Large
        required: true
    },

    pricePerDay: {
        type: Number,
        required: true
    },

    available: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('StorageUnit', storageUnitSchema);