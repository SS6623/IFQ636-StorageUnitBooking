const express = require("express");
const router = express.Router();

const {
  createUnit,
  getUnits,
  updateUnit,
  deleteUnit
} = require("../controllers/storageUnitController");

const { protect, admin } = require("../middleware/authMiddleware");

//  Get all units (public)
router.get("/", getUnits);

//  Create unit (admin only)
router.post("/", protect, admin, createUnit);

//  Update unit (admin only)
router.put("/:id", protect, admin, updateUnit);

//  Delete unit (admin only)
router.delete("/:id", protect, admin, deleteUnit);

module.exports = router;
``