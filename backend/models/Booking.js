const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StorageUnit',
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    totalCost: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);