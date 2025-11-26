const express = require("express");
const router = express.Router();

const Bat_Weapons = require("../models/bat_weapons.model");
const Character_Bat_Weapons = require("../models/character_bat_weapons.model");
const Characters = require("../models/characters.model");

router.get("/", async (req, res) => {
    const list = await Bat_Weapons.findAll();
    res.json(list);
});

router.get("/:id", async (req, res) => {
    const weapon = await Bat_Weapons.findByPk(req.params.id);
    res.json(weapon);
});

router.post("/", async (req, res) => {
    try {
        const newWeapon = await Bat_Weapons.create(req.body);
        res.json(newWeapon);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "Error creating weapon" });
    }
});


router.put("/:id", async (req, res) => {
    await Bat_Weapons.update(req.body, {
        where: { bat_weapon_id: req.params.id }
    });
    res.json({ message: "Weapon updated" });
});

router.delete("/:id", async (req, res) => {
    await Character_Bat_Weapons.destroy({ where: { bat_weapon_id: req.params.id } }); 
    await Bat_Weapons.destroy({ where: { bat_weapon_id: req.params.id } });

    res.json({ message: "Weapon deleted" });
});

module.exports = router;
