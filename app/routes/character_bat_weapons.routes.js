const express = require("express");
const router = express.Router();

const Character_Bat_Weapons = require("../models/character_bat_weapons.model");
const Characters = require("../models/characters.model");
const Weapons = require("../models/bat_weapons.model");

router.get("/", async (req, res) => {
    const items = await Character_Bat_Weapons.findAll({
        include: [Characters, Weapons]
    });

    res.json(items);
});

router.get("/bat_weapon/:bat_weapon_id", async (req, res) => {
    const rows = await Character_Bat_Weapons.findAll({
        where: { bat_weapon_id: req.params.bat_weapon_id },
        include: [{ model: Characters }]
    });

    res.json(rows);
});

router.post("/", async (req, res) => {
    const { bat_weapon_id, character_id } = req.body;

    const exists = await Character_Bat_Weapons.findOne({
        where: { bat_weapon_id, character_id }
    });

    if (exists) return res.status(400).json({ error: "Already assigned" });

    const item = await Character_Bat_Weapons.create(req.body);
    res.json(item);
});

router.delete("/:bat_weapon_id/:character_id", async (req, res) => {
    await Character_Bat_Weapons.destroy({
        where: {
            bat_weapon_id: req.params.bat_weapon_id,
            character_id: req.params.character_id
        }
    });

    res.json({ message: "Character removed from bat_weapon" });
});

module.exports = router;
