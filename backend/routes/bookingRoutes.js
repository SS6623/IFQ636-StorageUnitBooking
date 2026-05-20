const express = require("express");
const router = express.Router();

const {
    createBooking,
    getUserBookings,
    getAllBookings,
    cancelBooking
} = require("../controllers/bookingController");

const { protect, admin } = require("../middleware/authMiddleware");
const { payForBooking } = require("../controllers/bookingController");

/*  USER: Create booking */
router.post("/", protect, createBooking);

/*  USER: Get own bookings */
router.get("/my", protect, getUserBookings);

/*  ADMIN: Get all bookings */
router.get("/", protect, admin, getAllBookings);

/*  USER + ADMIN: Cancel booking */
router.put("/cancel/:id", protect, cancelBooking);

/*pay for booking*/
router.put("/pay/:id", protect, payForBooking);

module.exports = router;