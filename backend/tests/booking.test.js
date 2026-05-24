const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const StorageUnit = require("../models/StorageUnit");

const {
  createBooking,
  updateBooking,
  payForBooking,
  cancelBooking
} = require("../controllers/bookingController");

const { expect } = chai;

describe("Booking Controller Tests", () => {

  // ✅ VERY IMPORTANT (fixes sinon error)
  afterEach(() => {
    sinon.restore();
  });

  // ✅ CREATE BOOKING
  it("should create booking successfully", async () => {

    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        unitId: new mongoose.Types.ObjectId(),
        startDate: "2026-06-01",
        endDate: "2026-06-02"
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    sinon.stub(StorageUnit, "findById").resolves({
      pricePerDay: 10
    });

    sinon.stub(Booking.prototype, "save").resolves({
      status: "pending"
    });

    sinon.stub(Booking, "findOne").resolves(null);

    await createBooking(req, res);

    expect(res.status.calledWith(201)).to.be.true;
  });

  // ✅ UPDATE BOOKING
  it("should update booking and recalculate cost", async () => {

    const booking = {
      userId: new mongoose.Types.ObjectId(),
      unitId: new mongoose.Types.ObjectId(),
      startDate: "2026-06-01",
      endDate: "2026-06-02",
      save: sinon.stub().resolves()
    };

    sinon.stub(Booking, "findById").resolves(booking);

    sinon.stub(StorageUnit, "findById").resolves({
      pricePerDay: 20
    });

    const req = {
      params: { id: new mongoose.Types.ObjectId() },
      user: { _id: booking.userId, role: "user" },
      body: {
        startDate: "2026-06-01",
        endDate: "2026-06-03"
      }
    };

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    await updateBooking(req, res);

    expect(booking.totalCost).to.equal(3 * 20);
  });

  // ✅ PAY BOOKING
  it("should confirm payment", async () => {

    const booking = {
      status: "pending",
      save: sinon.stub().resolves()
    };

    sinon.stub(Booking, "findById").resolves(booking);

    const req = { params: { id: new mongoose.Types.ObjectId() } };

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    await payForBooking(req, res);

    expect(booking.status).to.equal("confirmed");
  });

  // ✅ CANCEL BOOKING
  it("should cancel booking", async () => {

    const booking = {
      userId: new mongoose.Types.ObjectId(),
      save: sinon.stub().resolves()
    };

    sinon.stub(Booking, "findById").resolves(booking);

    const req = {
      params: { id: new mongoose.Types.ObjectId() },
      user: { _id: booking.userId }
    };

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    await cancelBooking(req, res);

    expect(booking.status).to.equal("cancelled");
  });

});