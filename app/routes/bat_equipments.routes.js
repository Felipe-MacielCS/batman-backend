const express = require("express");
const router = express.Router();

const Bat_Equipments = require("../models/bat_equipments.model");
const Character_Bat_Equipments = require("../models/character_bat_equipments.model");
const Characters = require("../models/characters.model");

router.get("/", async (req, res) => {
    const list = await Bat_Equipments.findAll();
    res.json(list);
});

router.get("/:id", async (req, res) => {
    const equipment = await Bat_Equipments.findByPk(req.params.id);
    res.json(equipment);
});

router.post("/", async (req, res) => {
    try {
        const newEquipment = await Bat_Equipments.create(req.body);
        res.json(newEquipment);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "Error creating equipment" });
    }
});

router.put("/:id", async (req, res) => {
    await Bat_Equipments.update(req.body, {
        where: { bat_equipment_id: req.params.id }
    });
    res.json({ message: "Equipment updated" });
});

router.delete("/:id", async (req, res) => {
    await Character_Bat_Equipments.destroy({ where: { bat_equipment_id: req.params.id } }); 
    await Bat_Equipments.destroy({ where: { bat_equipment_id: req.params.id } });

    res.json({ message: "Equipment deleted" });
});

module.exports = router;
