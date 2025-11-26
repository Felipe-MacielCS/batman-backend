const express = require("express");
const router = express.Router();

const Character_Bat_Equipments = require("../models/character_bat_equipments.model");
const Characters = require("../models/characters.model");
const Equipments = require("../models/bat_equipments.model");

router.get("/", async (req, res) => {
    const items = await Character_Bat_Equipments.findAll({
        include: [Characters, Equipments]
    });

    res.json(items);
});

router.get("/bat_equipment/:bat_equipment_id", async (req, res) => {
    const rows = await Character_Bat_Equipments.findAll({
        where: { bat_equipment_id: req.params.bat_equipment_id },
        include: [{ model: Characters }]
    });

    res.json(rows);
});

router.post("/", async (req, res) => {
    const { bat_equipment_id, character_id } = req.body;

    const exists = await Character_Bat_Equipments.findOne({
        where: { bat_equipment_id, character_id }
    });

    if (exists) return res.status(400).json({ error: "Already assigned" });

    const item = await Character_Bat_Equipments.create(req.body);
    res.json(item);
});

router.delete("/:bat_equipment_id/:character_id", async (req, res) => {
    await Character_Bat_Equipments.destroy({
        where: {
            bat_equipment_id: req.params.bat_equipment_id,
            character_id: req.params.character_id
        }
    });

    res.json({ message: "Character removed from bat_equipment" });
});

module.exports = router;
