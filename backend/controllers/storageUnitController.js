const StorageUnit = require("../models/StorageUnit");

/* ✅ CREATE storage unit (ADMIN ONLY) */
const createUnit = async (req, res) => {
    try {
        const { name, size, pricePerDay } = req.body;

        const unit = new StorageUnit({
            name,
            size,
            pricePerDay,
            available: true
        });

        const savedUnit = await unit.save();

        res.status(201).json(savedUnit);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ✅ GET all storage units */
const getUnits = async (req, res) => {
    try {
        const units = await StorageUnit.find();
        res.json(units);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ✅ UPDATE storage unit (ADMIN ONLY) */
const updateUnit = async (req, res) => {
    try {
        const unit = await StorageUnit.findById(req.params.id);

        if (!unit) {
            return res.status(404).json({ message: "Unit not found" });
        }

        const { name, size, pricePerDay, available } = req.body;

        unit.name = name || unit.name;
        unit.size = size || unit.size;
        unit.pricePerDay = pricePerDay || unit.pricePerDay;
        unit.available = available ?? unit.available;

        const updatedUnit = await unit.save();

        res.json(updatedUnit);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ✅ DELETE storage unit (ADMIN ONLY) */
const deleteUnit = async (req, res) => {
    try {
        const unit = await StorageUnit.findById(req.params.id);

        if (!unit) {
            return res.status(404).json({ message: "Unit not found" });
        }

        await unit.deleteOne();

        res.json({ message: "Storage unit deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUnit,
    getUnits,
    updateUnit,
    deleteUnit
};
