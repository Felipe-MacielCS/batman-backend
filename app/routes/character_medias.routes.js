const express = require("express");
const router = express.Router();

const Character_Medias = require("../models/character_medias.model");
const Characters = require("../models/characters.model");
const Medias = require("../models/medias.model");

router.get("/", async (req, res) => {
    const items = await Character_Medias.findAll({
        include: [Characters, Medias]
    });

    res.json(items);
});

router.get("/media/:media_id", async (req, res) => {
    const rows = await Character_Medias.findAll({
        where: { media_id: req.params.media_id },
        include: [{ model: Characters }]
    });

    res.json(rows);
});

router.post("/", async (req, res) => {
    const { media_id, character_id } = req.body;

    const exists = await Character_Medias.findOne({
        where: { media_id, character_id }
    });

    if (exists) return res.status(400).json({ error: "Already assigned" });

    const item = await Character_Medias.create(req.body);
    res.json(item);
});

router.delete("/:media_id/:character_id", async (req, res) => {
    await Character_Medias.destroy({
        where: {
            media_id: req.params.media_id,
            character_id: req.params.character_id
        }
    });

    res.json({ message: "Character removed from media" });
});

module.exports = router;
