const express = require("express");
const router = express.Router();

const Character_Places = require("../models/character_places.model");
const Characters = require("../models/characters.model");
const Places = require("../models/places.model");

router.get("/", async (req, res) => {
    const items = await Character_Places.findAll({
        include: [Characters, Places]
    });

    res.json(items);
});

router.get("/place/:place_id", async (req, res) => {
    const rows = await Character_Places.findAll({
        where: { place_id: req.params.place_id },
        include: [{ model: Characters }]
    });

    res.json(rows);
});

router.post("/", async (req, res) => {
    const { place_id, character_id } = req.body;

    const exists = await Character_Places.findOne({
        where: { place_id, character_id }
    });

    if (exists) return res.status(400).json({ error: "Already assigned" });

    const item = await Character_Places.create(req.body);
    res.json(item);
});

router.delete("/:place_id/:character_id", async (req, res) => {
    await Character_Places.destroy({
        where: {
            place_id: req.params.place_id,
            character_id: req.params.character_id
        }
    });

    res.json({ message: "Character removed from place" });
});

module.exports = router;
