const express = require("express");
const router = express.Router();

const Places = require("../models/places.model");
const Character_Places = require("../models/character_places.model");
const Characters = require("../models/characters.model");

router.get("/", async (req, res) => {
    const list = await Places.findAll();
    res.json(list);
});

router.get("/:id", async (req, res) => {
    const place = await Places.findByPk(req.params.id);
    res.json(place);
});

router.post("/", async (req, res) => {
    try {
        const newPlace = await Places.create(req.body);
        res.json(newPlace);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "Error creating place" });
    }
});


router.put("/:id", async (req, res) => {
    await Places.update(req.body, {
        where: { place_id: req.params.id }
    });
    res.json({ message: "Place updated" });
});

router.delete("/:id", async (req, res) => {
    await Character_Places.destroy({ where: { place_id: req.params.id } }); // clear assignments
    await Places.destroy({ where: { place_id: req.params.id } });

    res.json({ message: "Place deleted" });
});

module.exports = router;
