const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const StorageUnit = require("../models/StorageUnit");

const {
  createBooking,
  getUserBookings,
  cancelBooking,
  payForBooking,
  updateBooking
} = require("../controllers/bookingController");

const { expect } = chai;

describe("Create Booking", () => {

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

    const unitStub = sinon.stub(StorageUnit, "findById").resolves({
      pricePerDay: 10
    });

    const saveStub = sinon.stub(Booking.prototype, "save").resolves();

    await createBooking(req, res);

    expect(saveStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;

    sinon.restore();
  });

});


describe("Update Booking", () => {

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
    expect(res.json.calledOnce).to.be.true;

    sinon.restore();
  });

});


describe("Pay Booking", () => {

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

    sinon.restore();
  });

});


describe("Cancel Booking", () => {

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

    sinon.restore();
  });

})