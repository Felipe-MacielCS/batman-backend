const express = require("express");
const router = express.Router();

const Medias = require("../models/medias.model");
const Character_Medias = require("../models/character_medias.model");
const Characters = require("../models/characters.model");

router.get("/", async (req, res) => {
    const list = await Medias.findAll();
    res.json(list);
});

router.get("/:id", async (req, res) => {
    const media = await Medias.findByPk(req.params.id);
    res.json(media);
});

router.post("/", async (req, res) => {
    try {
        const newMedia = await Medias.create(req.body);
        res.json(newMedia);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "Error creating media" });
    }
});


router.put("/:id", async (req, res) => {
    await Medias.update(req.body, {
        where: { media_id: req.params.id }
    });
    res.json({ message: "Media updated" });
});

router.delete("/:id", async (req, res) => {
    await Character_Medias.destroy({ where: { media_id: req.params.id } }); // clear assignments
    await Medias.destroy({ where: { media_id: req.params.id } });

    res.json({ message: "Media deleted" });
});

module.exports = router;
