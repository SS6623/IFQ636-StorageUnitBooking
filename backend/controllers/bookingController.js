const Booking = require("../models/Booking");
const StorageUnit = require("../models/StorageUnit");

/* ✅ CREATE booking */
const createBooking = async (req, res) => {
    try {
        const { unitId, startDate, endDate } = req.body;

        const unit = await StorageUnit.findById(unitId);


// ✅ Check if unit is already booked for selected dates
const existingBooking = await Booking.findOne({
    unitId,
    status: "confirmed",
    $or: [
        {
            startDate: { $lte: endDate },
            endDate: { $gte: startDate }
        }
    ]
});

if (existingBooking) {
    return res.status(400).json({
        message: "Unit already booked for selected dates"
    });
}



const start = new Date(startDate);
const end = new Date(endDate);

// ✅ Normalize time
start.setHours(0, 0, 0, 0);
end.setHours(0, 0, 0, 0);

// ✅ Calculate days safely
const diffTime = end - start;
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

// ✅ Calculate cost
const totalCost = diffDays * unit.pricePerDay;


        const booking = new Booking({
            userId: req.user._id,
            unitId,
            startDate,
            endDate,
            totalCost,
            status: "pending"
        });

        const savedBooking = await booking.save();


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


        res.json({ message: "Booking cancelled" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* pay for booking*/
const payForBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "confirmed";
    await booking.save();

    res.json({ message: "Payment successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
    createBooking,
    getUserBookings,
    getAllBookings,
    cancelBooking,
    payForBooking
};