const Booking = require("../models/Booking");
const StorageUnit = require("../models/StorageUnit");

/* ✅ CREATE booking */
const createBooking = async (req, res) => {
    try {
        const { unitId, startDate, endDate } = req.body;

        const unit = await StorageUnit.findById(unitId);

        if (!unit || !unit.available) {
            return res.status(400).json({ message: "Unit not available" });
        }

        const days =
            (new Date(endDate) - new Date(startDate)) /
            (1000 * 60 * 60 * 24);

        const totalCost = days * unit.pricePerDay;

        const booking = new Booking({
            userId: req.user._id,
            unitId,
            startDate,
            endDate,
            totalCost,
            status: "confirmed"
        });

        const savedBooking = await booking.save();

        // ✅ mark unit unavailable
        unit.available = false;
        await unit.save();

        res.status(201).json(savedBooking);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ✅ GET user bookings */
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate("unitId");

        res.json(bookings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ✅ GET ALL bookings (ADMIN ONLY) */
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("userId", "name email")
            .populate("unitId");

        res.json(bookings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ✅ CANCEL booking */
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // ✅ only owner OR admin
        if (
            booking.userId.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        booking.status = "cancelled";
        await booking.save();

        // ✅ free the unit again
        const unit = await StorageUnit.findById(booking.unitId);
        if (unit) {
            unit.available = true;
            await unit.save();
        }

        res.json({ message: "Booking cancelled" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getAllBookings,
    cancelBooking
};
