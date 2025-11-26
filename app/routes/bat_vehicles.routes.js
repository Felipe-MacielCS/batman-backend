const express = require("express");
const router = express.Router();

const Bat_Vehicles = require("../models/bat_vehicles.model");
const Character_Bat_Vehicles = require("../models/character_bat_vehicles.model");
const Characters = require("../models/characters.model");

router.get("/", async (req, res) => {
    const list = await Bat_Vehicles.findAll();
    res.json(list);
});

router.get("/:id", async (req, res) => {
    const vehicle = await Bat_Vehicles.findByPk(req.params.id);
    res.json(vehicle);
});

router.post("/", async (req, res) => {
    try {
        const newVehicle = await Bat_Vehicles.create(req.body);
        res.json(newVehicle);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "Error creating vehicle" });
    }
});

router.put("/:id", async (req, res) => {
    await Bat_Vehicles.update(req.body, {
        where: { bat_vehicle_id: req.params.id }
    });
    res.json({ message: "Vehicle updated" });
});

router.delete("/:id", async (req, res) => {
    await Character_Bat_Vehicles.destroy({ where: { bat_vehicle_id: req.params.id } }); 
    await Bat_Vehicles.destroy({ where: { bat_vehicle_id: req.params.id } });

    res.json({ message: "Vehicle deleted" });
});

module.exports = router;
