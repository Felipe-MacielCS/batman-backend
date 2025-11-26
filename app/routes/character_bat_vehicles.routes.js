const express = require("express");
const router = express.Router();

const Character_Bat_Vehicles = require("../models/character_bat_vehicles.model");
const Characters = require("../models/characters.model");
const Vehicles = require("../models/bat_vehicles.model");

router.get("/", async (req, res) => {
    const items = await Character_Bat_Vehicles.findAll({
        include: [Characters, Vehicles]
    });

    res.json(items);
});

router.get("/bat_vehicle/:bat_vehicle_id", async (req, res) => {
    const rows = await Character_Bat_Vehicles.findAll({
        where: { bat_vehicle_id: req.params.bat_vehicle_id },
        include: [{ model: Characters }]
    });

    res.json(rows);
});

router.post("/", async (req, res) => {
    const { bat_vehicle_id, character_id } = req.body;

    const exists = await Character_Bat_Vehicles.findOne({
        where: { bat_vehicle_id, character_id }
    });

    if (exists) return res.status(400).json({ error: "Already assigned" });

    const item = await Character_Bat_Vehicles.create(req.body);
    res.json(item);
});

router.delete("/:bat_vehicle_id/:character_id", async (req, res) => {
    await Character_Bat_Vehicles.destroy({
        where: {
            bat_vehicle_id: req.params.bat_vehicle_id,
            character_id: req.params.character_id
        }
    });

    res.json({ message: "Character removed from bat_vehicle" });
});

module.exports = router;
